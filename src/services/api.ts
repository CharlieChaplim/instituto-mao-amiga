// Navegador: localhost. Celular físico: IP do computador na mesma rede Wi-Fi.
// Android Emulator: http://10.0.2.2:8080/api/v1
const API_URL = 'http://localhost:8080/api/v1';

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function solicitar<T>(metodo: string, caminho: string, dados?: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: dados === undefined ? { Accept: 'application/json' } : {
        Accept: 'application/json', 'Content-Type': 'application/json',
      },
      body: dados === undefined ? undefined : JSON.stringify(dados),
      signal: controller.signal,
    });
    if (!resposta.ok) {
      throw new ApiError(resposta.status, resposta.status === 400
        ? 'Dados inválidos. Confira os campos informados.'
        : resposta.status === 404 ? 'Registro não encontrado.'
        : `Não foi possível concluir a solicitação (HTTP ${resposta.status}).`);
    }
    if (resposta.status === 204) return undefined as T;
    const texto = await resposta.text();
    return (texto ? JSON.parse(texto) : undefined) as T;
  } catch (erro: unknown) {
    if (erro instanceof ApiError) throw erro;
    throw new ApiError(0, controller.signal.aborted
      ? 'A API demorou para responder. Tente novamente.'
      : 'Não foi possível acessar a API. Verifique o servidor e a conexão.');
  } finally {
    clearTimeout(timeout);
  }
}

export const get = <T>(caminho: string): Promise<T> => solicitar<T>('GET', caminho);
export const post = <T>(caminho: string, dados: unknown): Promise<T> => solicitar<T>('POST', caminho, dados);
export const put = <T>(caminho: string, dados: unknown): Promise<T> => solicitar<T>('PUT', caminho, dados);
export const del = (caminho: string): Promise<void> => solicitar<void>('DELETE', caminho);

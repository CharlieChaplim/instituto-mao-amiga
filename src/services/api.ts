// Altere apenas esta URL para a máquina que executa o Spring Boot.
// Android Emulator: 10.0.2.2; dispositivo físico: IP LAN do computador.
const API_URL = 'http://localhost:8080';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); this.name = 'ApiError'; }
}

export async function obterJSON<T>(caminho: string): Promise<T> {
  let resposta: Response;
  try { resposta = await fetch(`${API_URL}${caminho}`); }
  catch { throw new ApiError(0, 'Não foi possível conectar à API. Verifique se o servidor está ligado.'); }
  if (!resposta.ok) throw new ApiError(resposta.status, resposta.status === 404 ? 'Ponto não encontrado' : 'Não foi possível carregar os pontos.');
  return (await resposta.json()) as T;
}

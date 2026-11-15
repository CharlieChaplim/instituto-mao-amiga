export const CHAVE_FAVORITOS = '@mao_amiga:pontos-favoritos';
type Armazenamento = { getItem(chave: string): Promise<string | null>; setItem(chave: string, valor: string): Promise<void> };
type Estado = { ids: string[]; carregando: boolean; salvando: boolean; erro: string };

export function criarFavoritos(storage: Armazenamento) {
  let estado: Estado = { ids: [], carregando: true, salvando: false, erro: '' };
  let carregado = false;
  let leitura: Promise<void> | null = null;
  let fila = Promise.resolve();
  const ouvintes = new Set<() => void>();
  function publicar(parte: Partial<Estado>) {
    estado = { ...estado, ...parte };
    ouvintes.forEach(fn => fn());
  }
  async function carregar() {
    if (carregado) return;
    if (leitura) return leitura;
    publicar({ carregando: true, erro: '' });
    leitura = (async () => {
      try {
        const texto = await storage.getItem(CHAVE_FAVORITOS);
        const dados: unknown = texto === null ? [] : JSON.parse(texto);
        if (!Array.isArray(dados) || !dados.every(id => typeof id === 'string' && id.trim())) {
          throw new Error('Formato inválido');
        }
        carregado = true;
        publicar({ ids: [...new Set(dados as string[])], carregando: false });
      } catch {
        publicar({ carregando: false, erro: 'Não foi possível ler os favoritos deste aparelho. Tente novamente.' });
      } finally { leitura = null; }
    })();
    return leitura;
  }
  function definir(id: string, favorito: boolean): Promise<void> {
    // Serializa escritas para preservar alterações feitas em pontos diferentes.
    const operacao = fila.then(async () => {
      await carregar();
      if (!carregado) throw new Error(estado.erro);
      publicar({ salvando: true });
      try {
        const ids = favorito ? [...new Set([...estado.ids, id])] : estado.ids.filter(atual => atual !== id);
        await storage.setItem(CHAVE_FAVORITOS, JSON.stringify(ids));
        publicar({ ids, erro: '' });
      } catch {
        throw new Error('Não foi possível salvar os favoritos. Tente novamente.');
      } finally { publicar({ salvando: false }); }
    });
    fila = operacao.catch(() => {});
    return operacao;
  }
  return {
    snapshot: () => estado,
    subscribe: (fn: () => void) => { ouvintes.add(fn); return () => { ouvintes.delete(fn); }; },
    carregar, definir,
  };
}

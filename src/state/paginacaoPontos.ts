import type { PaginaPontos, Ponto } from '../types/Ponto';

type Estado = { pontos: Ponto[]; carregando: boolean; erro: string; temMais: boolean };
type Buscar = (pagina: number, filtro: string) => Promise<PaginaPontos>;

// A trava é síncrona: dois onEndReached no mesmo render não repetem a página.
// A geração descarta respostas da busca anterior, mesmo se chegarem depois.
export function criarPaginacaoPontos(buscar: Buscar) {
  let estado: Estado = { pontos: [], carregando: true, erro: '', temMais: true };
  let geracao = 0;
  let filtro = '';
  let proxima = 0;
  let ocupado = false;
  const ouvintes = new Set<() => void>();
  function publicar(novo: Estado) {
    estado = novo;
    ouvintes.forEach(ouvinte => ouvinte());
  }
  async function carregar(repetir = false): Promise<void> {
    if (ocupado || !estado.temMais || (estado.erro && !repetir)) return;
    ocupado = true;
    const atual = geracao;
    const pagina = proxima;
    publicar({ ...estado, carregando: true, erro: '' });
    try {
      const resultado = await buscar(pagina, filtro);
      if (atual !== geracao) return;
      const pontos = new Map(estado.pontos.map(p => [p.id, p]));
      resultado.content.forEach(p => pontos.set(p.id, p));
      proxima = pagina + 1;
      publicar({ pontos: [...pontos.values()], carregando: false, erro: '',
        temMais: proxima < resultado.page.totalPages });
    } catch (erro: unknown) {
      if (atual !== geracao) return;
      publicar({ ...estado, carregando: false, erro: erro instanceof Error
        ? erro.message : 'Não foi possível carregar os pontos. Tente novamente.' });
    } finally {
      if (atual === geracao) ocupado = false;
    }
  }
  return {
    snapshot: () => estado,
    subscribe: (ouvinte: () => void) => { ouvintes.add(ouvinte); return () => { ouvintes.delete(ouvinte); }; },
    carregar,
    reiniciar(novoFiltro: string) {
      geracao += 1;
      filtro = novoFiltro;
      proxima = 0;
      ocupado = false;
      publicar({ pontos: [], carregando: true, erro: '', temMais: true });
      return carregar();
    },
    cancelar() { geracao += 1; ocupado = false; },
  };
}

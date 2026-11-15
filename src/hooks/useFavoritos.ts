import { useEffect, useSyncExternalStore } from 'react';
import { favoritos } from '../services/favoritosService';
import { useAvisos } from '../contexts/AvisosContext';

export function useFavoritos() {
  const estado = useSyncExternalStore(favoritos.subscribe, favoritos.snapshot, favoritos.snapshot);
  const { avisar } = useAvisos();
  useEffect(() => { void favoritos.carregar(); }, []);
  async function definir(id: string, valor: boolean) {
    try { await favoritos.definir(id, valor); }
    catch (e: unknown) { await avisar('Erro', e instanceof Error ? e.message : 'Não foi possível salvar os favoritos.'); }
  }
  return { ...estado, definir, tentarNovamente: favoritos.carregar };
}

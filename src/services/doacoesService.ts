import { get, post, put, del } from './api';
import type { Doacao, NovaDoacao, PaginaDoacoes } from '../types/Doacao';

export function buscarPaginaDoacoes(page = 0, filtro = '', size = 10): Promise<PaginaDoacoes> {
  return get<PaginaDoacoes>(`/doacoes/filtro?filtro=${encodeURIComponent(filtro.trim())}&page=${page}&size=${size}&sort=criadoEm,desc&sort=id,desc`);
}
export function buscarDoacaoPorId(id: string): Promise<Doacao> {
  return get<Doacao>(`/doacoes/${encodeURIComponent(id)}`);
}
export function cadastrarDoacao(dados: NovaDoacao): Promise<Doacao> {
  return post<Doacao>('/doacoes', dados);
}
export function editarDoacao(id: string, dados: NovaDoacao): Promise<Doacao> {
  return put<Doacao>(`/doacoes/${encodeURIComponent(id)}`, dados);
}
export function excluirDoacao(id: string): Promise<void> {
  return del(`/doacoes/${encodeURIComponent(id)}`);
}

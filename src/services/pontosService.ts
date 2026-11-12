import { get, post, put, del } from './api';
import type { PaginaPontos, Ponto, PontoRequest } from '../types/Ponto';

export function listarPontos(): Promise<Ponto[]> {
  return get<Ponto[]>('/pontos');
}
export function buscarPaginaPontos(page = 0, filtro = '', size = 10): Promise<PaginaPontos> {
  return get<PaginaPontos>(`/pontos/filtro?filtro=${encodeURIComponent(filtro.trim())}&page=${page}&size=${size}&sort=nome,asc&sort=id,asc`);
}
export function buscarPontoPorId(id: string): Promise<Ponto> {
  return get<Ponto>(`/pontos/${encodeURIComponent(id)}`);
}
export function cadastrarPonto(dados: PontoRequest): Promise<Ponto> {
  return post<Ponto>('/pontos', dados);
}
export function editarPonto(id: string, dados: PontoRequest): Promise<Ponto> {
  return put<Ponto>(`/pontos/${encodeURIComponent(id)}`, dados);
}
export function excluirPonto(id: string): Promise<void> {
  return del(`/pontos/${encodeURIComponent(id)}`);
}

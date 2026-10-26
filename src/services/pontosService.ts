import { obterJSON } from './api';
import type { PaginaPontos, Ponto } from '../types/ponto';

export function listarPontos(page = 0, size = 20): Promise<PaginaPontos> {
  return obterJSON<PaginaPontos>(`/pontos?page=${page}&size=${size}&sort=nome,asc`);
}
export function buscarPontoPorId(id: number): Promise<Ponto> {
  return obterJSON<Ponto>(`/pontos/${id}`);
}

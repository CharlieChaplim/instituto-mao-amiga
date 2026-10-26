export type Ponto = {
  id: number;
  nome: string;
  endereco: string;
  horario: string;
  atendimento: string;
  latitude: number;
  longitude: number;
};
export type PaginaPontos = {
  content: Ponto[];
  page: { size: number; number: number; totalElements: number; totalPages: number };
};

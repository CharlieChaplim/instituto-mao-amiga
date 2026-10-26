import type { Doacao } from './Doacao';
export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: number };
  Cadastro: { doacao?: Doacao } | undefined;
  Historico: undefined;
  DetalheDoacao: { doacao: Doacao };
};

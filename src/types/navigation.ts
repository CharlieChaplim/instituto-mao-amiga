import type { Doacao } from './Doacao';
export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  CadastroPonto: { pontoId?: string } | undefined;
  Cadastro: { doacao?: Doacao } | undefined;
  Historico: undefined;
  DetalheDoacao: { doacao: Doacao };
};

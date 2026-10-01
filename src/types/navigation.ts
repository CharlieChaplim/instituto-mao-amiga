import { Doacao } from './Doacao';

export type RootStackParamList = {
  Lista: undefined;

  Detalhe: {
    pontoId: string;
  };

  Cadastro:
    | {
        doacao?: Doacao;
      }
    | undefined;

  Historico: undefined;

  DetalheDoacao: {
    doacao: Doacao;
  };
};
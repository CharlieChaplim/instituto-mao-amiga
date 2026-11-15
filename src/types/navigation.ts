export type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  CadastroPonto: { pontoId?: string } | undefined;
  Cadastro: { doacaoId?: string } | undefined;
  Historico: undefined;
  DetalheDoacao: { doacaoId: string };
};

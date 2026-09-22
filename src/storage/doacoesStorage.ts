import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_DOACOES = '@mao_amiga:doacoes';

export type DoacaoRegistrada = {
  id: string;
  nome: string;
  item: string;
  quantidade: string;
  observacao: string;
  data: string;
};

type NovaDoacao = {
  nome: string;
  item: string;
  quantidade: string;
  observacao: string;
};

export async function carregarDoacoes(): Promise<DoacaoRegistrada[]> {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_DOACOES);

    if (!dados) {
      return [];
    }

    return JSON.parse(dados);
  } catch (erro) {
    console.error('Erro ao carregar doações:', erro);
    return [];
  }
}

export async function registrarDoacao(
  doacao: NovaDoacao
): Promise<DoacaoRegistrada> {
  const doacoes = await carregarDoacoes();

  const novaDoacao: DoacaoRegistrada = {
    id: Date.now().toString(),
    nome: doacao.nome,
    item: doacao.item,
    quantidade: doacao.quantidade,
    observacao: doacao.observacao,
    data: new Date().toISOString(),
  };

  doacoes.push(novaDoacao);

  await AsyncStorage.setItem(
    CHAVE_DOACOES,
    JSON.stringify(doacoes)
  );

  return novaDoacao;
}

export async function removerDoacao(id: string): Promise<void> {
  const doacoes = await carregarDoacoes();

  const novasDoacoes = doacoes.filter(
    (doacao) => doacao.id !== id
  );

  await AsyncStorage.setItem(
    CHAVE_DOACOES,
    JSON.stringify(novasDoacoes)
  );
}

export async function limparDoacoes(): Promise<void> {
  await AsyncStorage.removeItem(CHAVE_DOACOES);
}
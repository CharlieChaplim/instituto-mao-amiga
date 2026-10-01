import AsyncStorage from '@react-native-async-storage/async-storage';

import { Doacao, NovaDoacao } from '../types/Doacao';

const CHAVE_DOACOES = '@mao_amiga:doacoes';

export async function listarDoacoes(): Promise<Doacao[]> {
  const valor = await AsyncStorage.getItem(CHAVE_DOACOES);

  if (!valor) {
    return [];
  }

  return JSON.parse(valor) as Doacao[];
}

function gerarId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function salvarDoacao(
  doacao: NovaDoacao
): Promise<Doacao> {
  const doacoes = await listarDoacoes();

  const novaDoacao: Doacao = {
    ...doacao,
    id: gerarId(),
    criadoEm: new Date().toISOString(),
  };

  await AsyncStorage.setItem(
    CHAVE_DOACOES,
    JSON.stringify([...doacoes, novaDoacao])
  );

export async function excluirDoacao(id: string): Promise<void> {
  const doacoes = await listarDoacoes();

  const atualizadas = doacoes.filter(
    (doacao) => doacao.id !== id
  );

  await AsyncStorage.setItem(
    CHAVE_DOACOES,
    JSON.stringify(atualizadas)
  );
}

  return novaDoacao;
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doacao } from '../types/Doacao';

const CHAVE_ULTIMA_DOACAO = '@mao_amiga:ultima_doacao';

export async function salvarDoacao(doacao: Doacao) {
  await AsyncStorage.setItem(CHAVE_ULTIMA_DOACAO, JSON.stringify(doacao));
}

export async function carregarDoacao(): Promise<Doacao | null> {
  const valor = await AsyncStorage.getItem(CHAVE_ULTIMA_DOACAO);

  if (!valor) {
    return null;
  }

  return JSON.parse(valor) as Doacao;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Doacao, NovaDoacao } from '../types/Doacao';
const CHAVE_DOACOES = '@mao_amiga:doacoes';
export async function listarDoacoes(): Promise<Doacao[]> {
  const valor = await AsyncStorage.getItem(CHAVE_DOACOES);
  if (!valor) return [];
  const resultado: unknown = JSON.parse(valor);
  if (!Array.isArray(resultado)) throw new Error('Histórico inválido');
  return resultado as Doacao[];
}
function gerarId(): string { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
export async function salvarDoacao(doacao: NovaDoacao): Promise<Doacao> {
  const lista = await listarDoacoes();
  const nova: Doacao = { ...doacao, id: gerarId(), criadoEm: new Date().toISOString() };
  await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify([...lista, nova]));
  return nova;
}
export async function excluirDoacao(id: string): Promise<void> {
  await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify((await listarDoacoes()).filter(d => d.id !== id)));
}
export async function atualizarDoacao(doacao: Doacao): Promise<void> {
  await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify((await listarDoacoes()).map(d => d.id === doacao.id ? doacao : d)));
}

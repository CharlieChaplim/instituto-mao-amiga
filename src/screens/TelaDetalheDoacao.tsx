import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { buscarDoacaoPorId } from '../services/doacoesService';
import { ApiError } from '../services/api';
import type { Doacao } from '../types/Doacao';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;
export function TelaDetalheDoacao({ route }: Props) {
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [tentativa, setTentativa] = useState(0);
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true); setErro(''); setDoacao(null);
    buscarDoacaoPorId(route.params.doacaoId).then(dados => {
      if (ativo) setDoacao(dados);
    }).catch((e: unknown) => {
      if (ativo) setErro(e instanceof ApiError && e.status === 404
        ? 'Doação não encontrada.' : 'Não foi possível carregar a doação. Verifique a API e tente novamente.');
    }).finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [route.params.doacaoId, tentativa]));
  return <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom', 'left', 'right']}>
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      {carregando ? <><ActivityIndicator /><Text>Carregando doação...</Text></> : null}
      {erro ? <><Text accessibilityRole="alert">{erro}</Text>
        <TouchableOpacity accessibilityRole="button" onPress={() => setTentativa(t => t + 1)}><Text>Tentar novamente</Text></TouchableOpacity></> : null}
      {doacao ? <><Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1B3A5C' }}>{doacao.tipoItem}</Text>
        <Text>Quantidade: {doacao.quantidade}</Text><Text>Ponto de destino: {doacao.pontoDestino}</Text>
        <Text>Registrado em: {new Date(doacao.criadoEm).toLocaleString('pt-BR')}</Text><Text>ID: {doacao.id}</Text></> : null}
    </ScrollView>
  </SafeAreaView>;
}

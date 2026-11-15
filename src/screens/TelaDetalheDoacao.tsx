import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { buscarDoacaoPorId, excluirDoacao } from '../services/doacoesService';
import { useAvisos } from '../contexts/AvisosContext';
import { ApiError } from '../services/api';
import type { Doacao } from '../types/Doacao';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;
export function TelaDetalheDoacao({ route, navigation }: Props) {
  const { avisar, confirmar } = useAvisos();
  const trava = useRef(false);
  const [excluindo, setExcluindo] = useState(false);
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
  async function remover() {
    if (!doacao || trava.current) return;
    trava.current = true; setExcluindo(true);
    try {
      if (!await confirmar('Excluir doação', `Deseja excluir a doação de “${doacao.tipoItem}”?`)) return;
      await excluirDoacao(doacao.id);
      await avisar('Sucesso', `Doação de “${doacao.tipoItem}” excluída.`);
      navigation.goBack();
    } catch (e: unknown) {
      await avisar('Erro', e instanceof ApiError && e.status === 404
        ? 'Doação não encontrada. Ela pode ter sido excluída em outro dispositivo.'
        : 'Não foi possível excluir a doação. Verifique a API e tente novamente.');
    } finally { trava.current = false; setExcluindo(false); }
  }
  return <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom', 'left', 'right']}>
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      {carregando ? <><ActivityIndicator /><Text>Carregando doação...</Text></> : null}
      {erro ? <><Text accessibilityRole="alert">{erro}</Text>
        <TouchableOpacity accessibilityRole="button" onPress={() => setTentativa(t => t + 1)}><Text>Tentar novamente</Text></TouchableOpacity></> : null}
      {doacao ? <><Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1B3A5C' }}>{doacao.tipoItem}</Text>
        <Text>Quantidade: {doacao.quantidade}</Text><Text>Ponto de destino: {doacao.pontoDestino}</Text>
        <Text>Registrado em: {new Date(doacao.criadoEm).toLocaleString('pt-BR')}</Text><Text>ID: {doacao.id}</Text>
        <TouchableOpacity accessibilityRole="button" disabled={excluindo} style={{ padding: 14, backgroundColor: '#1B3A5C', borderRadius: 8 }} onPress={() => navigation.navigate('Cadastro', { doacaoId: doacao.id })}><Text style={{ color: '#fff', textAlign: 'center' }}>Editar doação</Text></TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" disabled={excluindo} style={{ padding: 14, backgroundColor: '#C62828', borderRadius: 8 }} onPress={() => void remover()}><Text style={{ color: '#fff', textAlign: 'center' }}>{excluindo ? 'Aguarde...' : 'Excluir doação'}</Text></TouchableOpacity></> : null}
    </ScrollView>
  </SafeAreaView>;
}

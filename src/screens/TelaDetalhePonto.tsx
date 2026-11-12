import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemDetalhe } from '../components/ItemDetalhe';
import { useAvisos } from '../contexts/AvisosContext';
import { ApiError } from '../services/api';
import { buscarPontoPorId, excluirPonto } from '../services/pontosService';
import type { Ponto } from '../types/Ponto';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;
export function TelaDetalhePonto({ route, navigation }: Props) {
  const { avisar, confirmar } = useAvisos();
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const trava = useRef(false);
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true); setErro(''); setPonto(null);
    buscarPontoPorId(route.params.pontoId).then(p => { if (ativo) setPonto(p); })
      .catch((e: unknown) => { if (ativo) setErro(e instanceof ApiError && e.status === 404
        ? 'Ponto não encontrado.' : 'Erro ao carregar o ponto. Verifique a conexão com a API.'); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [route.params.pontoId]));
  async function excluir() {
    if (!ponto || trava.current) return;
    trava.current = true; setExcluindo(true);
    try {
      if (!await confirmar('Excluir ponto', `Deseja excluir o ponto “${ponto.nome}”?`)) return;
      await excluirPonto(ponto.id);
      await avisar('Sucesso', `Ponto “${ponto.nome}” excluído.`);
      navigation.goBack();
    } catch (e: unknown) {
      await avisar('Não foi possível excluir', e instanceof Error ? e.message : 'Tente novamente.');
    } finally { trava.current = false; setExcluindo(false); }
  }
  return <SafeAreaView style={styles.area} edges={['bottom', 'left', 'right']}>
    {carregando ? <ActivityIndicator style={styles.margem} /> : erro ? <View style={styles.margem}><Text>{erro}</Text></View>
      : ponto ? <ScrollView contentContainerStyle={styles.margem}>
        <ItemDetalhe ponto={ponto} />
        <TouchableOpacity accessibilityRole="button" disabled={excluindo} style={styles.editar}
          onPress={() => navigation.navigate('CadastroPonto', { pontoId: ponto.id })}>
          <Text style={styles.texto}>Editar ponto</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" disabled={excluindo} style={styles.excluir} onPress={() => { void excluir(); }}>
          <Text style={styles.texto}>{excluindo ? 'Aguarde...' : 'Excluir ponto'}</Text>
        </TouchableOpacity>
      </ScrollView> : null}
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: '#fff' }, margem: { padding: 20 },
  editar: { minHeight: 44, padding: 14, marginTop: 20, borderRadius: 8, backgroundColor: '#1B3A5C', alignItems: 'center' },
  excluir: { minHeight: 44, padding: 14, marginTop: 12, borderRadius: 8, backgroundColor: '#C62828', alignItems: 'center' },
  texto: { color: '#fff', fontWeight: 'bold' },
});

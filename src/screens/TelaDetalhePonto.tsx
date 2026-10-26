import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemDetalhe } from '../components/ItemDetalhe';
import { ApiError } from '../services/api';
import { buscarPontoPorId } from '../services/pontosService';
import type { Ponto } from '../types/ponto';
import type { RootStackParamList } from '../types/navigation';
type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;
export function TelaDetalhePonto({ route }: Props) {
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    let ativo = true;
    setCarregando(true); setErro(''); setPonto(null);
    buscarPontoPorId(route.params.pontoId).then(d => {if(ativo) setPonto(d);}).catch((e: unknown) => {
      if (ativo) setErro(e instanceof ApiError && e.status === 404 ? 'Ponto não encontrado.' : 'Erro ao carregar o ponto. Verifique a conexão com a API.');
    }).finally(() => {if(ativo) setCarregando(false);});
    return () => {ativo = false;};
  }, [route.params.pontoId]);
  return <SafeAreaView style={styles.area} edges={['bottom','left','right']}>
    {carregando ? <ActivityIndicator style={styles.margem}/> : erro ? <View style={styles.margem}><Text>{erro}</Text></View> : ponto ? <ScrollView contentContainerStyle={styles.margem}><ItemDetalhe ponto={ponto}/></ScrollView> : null}
  </SafeAreaView>;
}
const styles=StyleSheet.create({area:{flex:1,backgroundColor:'#fff'},margem:{padding:20}});

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PontoItem } from '../components/PontoItem';
import { listarPontos } from '../services/pontosService';
import type { Ponto } from '../types/ponto';
import type { RootStackParamList } from '../types/navigation';
type Props = NativeStackScreenProps<RootStackParamList, 'Lista'>;
export function TelaListaPontos({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [pagina, setPagina] = useState(0);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const carregar = useCallback(async (numero: number) => {
    setCarregando(true); setErro('');
    try {
      const dados = await listarPontos(numero);
      setPontos(atuais => numero === 0 ? dados.content : [...atuais, ...dados.content.filter(p => !atuais.some(a => a.id === p.id))]);
      setPagina(numero);
      setTemMais(numero + 1 < dados.page.totalPages);
    } catch {
      setErro('Não foi possível carregar os pontos. Verifique se a API está ligada e tente novamente.');
    } finally { setCarregando(false); }
  }, []);
  useFocusEffect(useCallback(() => { void carregar(0); }, [carregar]));
  return <SafeAreaView style={styles.area} edges={['bottom','left','right']}>
    <FlatList data={pontos} keyExtractor={p => String(p.id)} contentContainerStyle={styles.conteudo}
      renderItem={({item}) => <PontoItem ponto={item} onPress={() => navigation.navigate('Detalhe', { pontoId: item.id })} />}
      ListHeaderComponent={<View><Text style={styles.titulo}>Pontos de coleta e distribuição</Text>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Cadastro')}><Text style={styles.botaoTexto}>Criar doação</Text></TouchableOpacity>
        <TouchableOpacity style={styles.secundario} onPress={() => navigation.navigate('Historico')}><Text>Minhas doações</Text></TouchableOpacity></View>}
      ListEmptyComponent={!carregando && !erro ? <Text>Nenhum ponto cadastrado.</Text> : null}
      ListFooterComponent={<View>{erro ? <Text style={styles.erro}>{erro}</Text> : null}
        {carregando ? <ActivityIndicator /> : <TouchableOpacity style={styles.secundario} onPress={() => void carregar(temMais ? pagina+1 : 0)}><Text>{erro ? 'Tentar novamente' : temMais ? 'Carregar mais' : 'Atualizar'}</Text></TouchableOpacity>}</View>}
    />
  </SafeAreaView>;
}
const styles = StyleSheet.create({area:{flex:1,backgroundColor:'#fff'},conteudo:{padding:20,paddingBottom:32},titulo:{fontSize:22,fontWeight:'bold',color:'#1B3A5C',marginBottom:16},botao:{padding:14,backgroundColor:'#2E7D32',borderRadius:8,alignItems:'center',marginBottom:12},botaoTexto:{color:'#fff',fontWeight:'bold'},secundario:{padding:14,borderWidth:1,borderColor:'#1B3A5C',borderRadius:8,alignItems:'center',marginBottom:16},erro:{color:'#B71C1C',marginVertical:12}});

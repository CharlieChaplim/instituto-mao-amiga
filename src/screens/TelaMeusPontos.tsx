import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoritos } from '../hooks/useFavoritos';
import { buscarPontoPorId } from '../services/pontosService';
import { ApiError } from '../services/api';
import { PontoItem } from '../components/PontoItem';
import type { Ponto } from '../types/Ponto';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'MeusPontos'>;
export function TelaMeusPontos({ navigation }: Props) {
  const favoritos = useFavoritos();
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  useFocusEffect(useCallback(() => {
    let ativo = true;
    if (favoritos.carregando || favoritos.erro) return;
    setCarregando(true); setErro('');
    async function carregar() {
      const resultados = await Promise.allSettled(favoritos.ids.map(buscarPontoPorId));
      if (!ativo) return;
      const encontrados: Ponto[] = [];
      let falhou = false;
      resultados.forEach(resultado => {
        if (resultado.status === 'fulfilled') encontrados.push(resultado.value);
        else if (!(resultado.reason instanceof ApiError && resultado.reason.status === 404)) falhou = true;
      });
      setPontos(encontrados);
      setErro(falhou ? 'Não foi possível carregar todos os favoritos. Verifique a API e tente novamente.' : '');
      setCarregando(false);
    }
    void carregar();
    return () => { ativo = false; };
  }, [favoritos.ids, favoritos.carregando, favoritos.erro, tentativa]));
  const visiveis = pontos.filter(p => favoritos.ids.includes(p.id));
  const mensagemErro = favoritos.erro || erro;
  const ocupado = favoritos.carregando || (carregando && !favoritos.erro);
  return <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom', 'left', 'right']}>
    <FlatList data={visiveis} keyExtractor={p => p.id} contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => <PontoItem ponto={item} favorito desabilitado={favoritos.salvando}
        onFavorito={() => void favoritos.definir(item.id, false)}
        onPress={() => navigation.navigate('Detalhe', { pontoId: item.id })} />}
      ListHeaderComponent={<Text style={{ fontSize: 22, color: '#1B3A5C', fontWeight: 'bold', marginBottom: 16 }}>Meus pontos</Text>}
      ListEmptyComponent={!ocupado && !mensagemErro ? <Text>Nenhum ponto favorito disponível. Marque ♡ na lista de pontos.</Text> : null}
      ListFooterComponent={<View>
        {ocupado ? <><ActivityIndicator/><Text>Carregando favoritos...</Text></> : null}
        {mensagemErro ? <><Text accessibilityRole="alert" style={{ color: '#B71C1C' }}>{mensagemErro}</Text>
          <TouchableOpacity accessibilityRole="button" style={{ padding: 14, minHeight: 44 }} onPress={() => {
            if (favoritos.erro) void favoritos.tentarNovamente();
            else setTentativa(t => t + 1);
          }}><Text>Tentar novamente</Text></TouchableOpacity></> : null}
      </View>}/>
  </SafeAreaView>;
}

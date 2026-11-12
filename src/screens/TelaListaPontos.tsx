import { useCallback, useState, useSyncExternalStore } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PontoItem } from '../components/PontoItem';
import { buscarPaginaPontos } from '../services/pontosService';
import { criarPaginacaoPontos } from '../state/paginacaoPontos';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Lista'>;
export function TelaListaPontos({ navigation }: Props) {
  const [busca, setBusca] = useState('');
  const [paginacao] = useState(() => criarPaginacaoPontos(buscarPaginaPontos));
  const { pontos, carregando, erro, temMais } = useSyncExternalStore(
    paginacao.subscribe, paginacao.snapshot, paginacao.snapshot,
  );
  useFocusEffect(useCallback(() => {
    void paginacao.reiniciar(busca);
    return () => paginacao.cancelar();
  }, [busca, paginacao]));

  return <SafeAreaView style={styles.area} edges={['bottom', 'left', 'right']}>
    <FlatList data={pontos} keyExtractor={p => p.id}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      onEndReached={() => { void paginacao.carregar(); }} onEndReachedThreshold={0.3}
      renderItem={({ item }) => <PontoItem ponto={item}
        onPress={() => navigation.navigate('Detalhe', { pontoId: item.id })} />}
      ListHeaderComponent={<View>
        <Text style={styles.titulo}>Pontos de coleta e distribuição</Text>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.botaoTexto}>Criar doação</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secundario} onPress={() => navigation.navigate('Historico')}>
          <Text>Minhas doações</Text>
        </TouchableOpacity>
        <Text style={styles.rotulo}>Buscar por nome ou bairro</Text>
        <TextInput style={styles.input} value={busca} onChangeText={setBusca}
          placeholder="Ex.: Central" accessibilityLabel="Buscar por nome ou bairro"
          autoCapitalize="none" autoCorrect={false} />
      </View>}
      ListEmptyComponent={!carregando && !erro
        ? <Text>{busca.trim() ? `Nenhum ponto encontrado para “${busca.trim()}”.` : 'Nenhum ponto cadastrado.'}</Text>
        : null}
      ListFooterComponent={<View style={styles.rodape}>
        {carregando ? <View><ActivityIndicator accessibilityLabel="Carregando pontos" />
          <Text style={styles.status}>{pontos.length === 0 ? 'Carregando pontos...' : 'Carregando mais pontos...'}</Text>
        </View> : null}
        {erro ? <View><Text style={styles.erro} accessibilityRole="alert">{erro}</Text>
          <TouchableOpacity style={styles.secundario} onPress={() => { void paginacao.carregar(true); }}>
            <Text>Tentar novamente</Text>
          </TouchableOpacity></View> : null}
        {!carregando && !erro && !temMais && pontos.length > 0
          ? <Text style={styles.status}>Todos os pontos foram carregados.</Text> : null}
      </View>}
    />
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: '#fff' },
  conteudo: { padding: 20, paddingBottom: 32 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 16 },
  botao: { minHeight: 44, padding: 14, backgroundColor: '#2E7D32', borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  secundario: { minHeight: 44, padding: 14, borderWidth: 1, borderColor: '#1B3A5C', borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  rotulo: { fontWeight: 'bold', color: '#1B3A5C', marginBottom: 8 },
  input: { minHeight: 44, padding: 12, borderWidth: 1, borderColor: '#aaa', borderRadius: 8, marginBottom: 20 },
  erro: { color: '#B71C1C', marginVertical: 12 },
  rodape: { paddingVertical: 16 },
  status: { textAlign: 'center', color: '#555', marginTop: 8 },
});

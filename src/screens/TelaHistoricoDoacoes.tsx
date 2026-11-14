import { useCallback, useState, useSyncExternalStore } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DoacaoItem } from '../components/DoacaoItem';
import { buscarPaginaDoacoes } from '../services/doacoesService';
import { criarPaginacaoDoacoes } from '../state/paginacaoDoacoes';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Historico'>;
export function TelaHistoricoDoacoes({ navigation }: Props) {
  const [busca, setBusca] = useState('');
  const [paginacao] = useState(() => criarPaginacaoDoacoes(buscarPaginaDoacoes));
  const { doacoes, carregando, erro, temMais } = useSyncExternalStore(
    paginacao.subscribe, paginacao.snapshot, paginacao.snapshot,
  );
  useFocusEffect(useCallback(() => {
    void paginacao.reiniciar(busca);
    return () => paginacao.cancelar();
  }, [busca, paginacao]));

  return <SafeAreaView style={styles.area} edges={['bottom', 'left', 'right']}>
    <FlatList data={doacoes} keyExtractor={p => p.id}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      onEndReached={() => { void paginacao.carregar(); }} onEndReachedThreshold={0.3}
      renderItem={({ item }) => <DoacaoItem doacao={item}
        onPress={() => navigation.navigate('DetalheDoacao', { doacaoId: item.id })} />}
      ListHeaderComponent={<View>
        <Text style={styles.titulo}>Minhas doações</Text>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.botaoTexto}>Criar doação</Text>
        </TouchableOpacity>
        <Text style={styles.rotulo}>Buscar por tipo de item</Text>
        <TextInput style={styles.input} value={busca} onChangeText={setBusca}
          placeholder="Ex.: roupas" accessibilityLabel="Buscar por tipo de item"
          autoCapitalize="none" autoCorrect={false} />
      </View>}
      ListEmptyComponent={!carregando && !erro
        ? <Text>{busca.trim() ? `Nenhuma doação encontrada para “${busca.trim()}”.` : 'Nenhuma doação cadastrada.'}</Text>
        : null}
      ListFooterComponent={<View style={styles.rodape}>
        {carregando ? <View><ActivityIndicator accessibilityLabel="Carregando doações" />
          <Text style={styles.status}>{doacoes.length === 0 ? 'Carregando doações...' : 'Carregando mais doações...'}</Text>
        </View> : null}
        {erro ? <View><Text style={styles.erro} accessibilityRole="alert">{erro}</Text>
          <TouchableOpacity style={styles.secundario} onPress={() => { void paginacao.carregar(true); }}>
            <Text>Tentar novamente</Text>
          </TouchableOpacity></View> : null}
        {!carregando && !erro && !temMais && doacoes.length > 0
          ? <Text style={styles.status}>Todas as doações foram carregadas.</Text> : null}
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

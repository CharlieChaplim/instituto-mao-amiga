import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PontoItem } from '../components/PontoItem';
import { pontosMock } from '../data/pontos';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Lista'>;

export function TelaListaPontos({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <FlatList
          data={pontosMock}
          keyExtractor={(ponto) => ponto.id}
          renderItem={({ item }) => (
            <PontoItem
              ponto={item}
              onPress={() => navigation.navigate('Detalhe', { pontoId: item.id })}
            />
          )}
          ListHeaderComponent={
            <View>
              <Text style={styles.titulo}>Pontos de coleta e distribuição</Text>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate('Cadastro')}
              >
                <Text style={styles.textoBotao}>Criar doação</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={styles.lista}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  lista: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  titulo: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  botao: {
    width: '100%',
    minHeight: 44,
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

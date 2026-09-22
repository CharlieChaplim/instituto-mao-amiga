import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemDetalhe } from '../components/ItemDetalhe';
import { pontosMock } from '../data/pontos';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

export function TelaDetalhePonto({ route }: Props) {
  const ponto = pontosMock.find((item) => item.id === route.params.pontoId);

  if (!ponto) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.container}>
          <Text style={styles.titulo}>Ponto não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <ItemDetalhe ponto={ponto} />
      </ScrollView>
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
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    padding: 20,
    paddingBottom: 32,
  },
  titulo: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
});

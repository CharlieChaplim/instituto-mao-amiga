import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { excluirDoacao } from '../storage/doacoesStorage';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'DetalheDoacao'
>;

export function TelaDetalheDoacao({
  route,
  navigation,
}: Props) {
  const { doacao } = route.params;

  function confirmarExclusao() {
    Alert.alert(
      'Excluir doação',
      'Tem certeza que deseja excluir esta doação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirDoacao(doacao.id);
              navigation.goBack();
            } catch {
              Alert.alert(
                'Erro',
                'Não foi possível excluir a doação.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['bottom', 'left', 'right']}
    >
      <View style={styles.container}>
        <Text style={styles.titulo}>
          {doacao.tipoItem}
        </Text>

        <Text style={styles.campo}>
          Quantidade: {doacao.quantidade}
        </Text>

        <Text style={styles.campo}>
          Ponto de destino: {doacao.pontoDestino}
        </Text>

        <Text style={styles.campo}>
          Registrado em:{' '}
          {new Date(doacao.criadoEm).toLocaleString('pt-BR')}
        </Text>

        <Text style={styles.campo}>
          ID: {doacao.id}
        </Text>

        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={confirmarExclusao}
        >
          <Text style={styles.textoExcluir}>
            Excluir doação
          </Text>
        </TouchableOpacity>
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
    padding: 20,
  },

  titulo: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },

  campo: {
    marginBottom: 12,
    fontSize: 16,
    color: '#333333',
  },

  botaoExcluir: {
    minHeight: 44,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#C62828',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoExcluir: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';

import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { DoacaoItem } from '../components/DoacaoItem';
import { listarDoacoes } from '../storage/doacoesStorage';
import { Doacao } from '../types/Doacao';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Historico'
>;

export function TelaHistoricoDoacoes({
  navigation,
}: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);

  async function carregarDoacoes() {
    try {
      const dados = await listarDoacoes();
      setDoacoes([...dados].reverse());
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível carregar as doações.'
      );
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarDoacoes();
    }, [])
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['bottom', 'left', 'right']}
    >
      <FlatList
        data={doacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoacaoItem doacao={item} />
        )}
        contentContainerStyle={
          doacoes.length === 0
            ? styles.listaVazia
            : styles.lista
        }
        ListHeaderComponent={
          doacoes.length > 0 ? (
            <Text style={styles.titulo}>
              Minhas doações
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.titulo}>
              Nenhuma doação cadastrada
            </Text>

            <Text style={styles.mensagem}>
              Cadastre uma doação para começar o histórico.
            </Text>

            <TouchableOpacity
              style={styles.botao}
              onPress={() => navigation.navigate('Cadastro')}
            >
              <Text style={styles.textoBotao}>
                Cadastrar doação
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  lista: {
    padding: 20,
    paddingBottom: 40,
  },

  listaVazia: {
    flexGrow: 1,
    padding: 20,
  },

  titulo: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },

  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mensagem: {
    marginBottom: 20,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },

  botao: {
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
  },

  textoBotao: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
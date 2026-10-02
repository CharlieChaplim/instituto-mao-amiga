import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
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
  const [busca, setBusca] = useState('');

  const doacoesFiltradas = useMemo(() => {
    const termo = busca
      .trim()
      .toLocaleLowerCase('pt-BR');

    if (!termo) {
      return doacoes;
    }

    return doacoes.filter((doacao) =>
      doacao.tipoItem
        .toLocaleLowerCase('pt-BR')
        .includes(termo)
    );
  }, [busca, doacoes]);

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
        data={doacoesFiltradas}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <DoacaoItem
            doacao={item}
            onPress={() =>
              navigation.navigate('DetalheDoacao', {
                doacao: item,
              })
            }
          />
        )}
        contentContainerStyle={
          doacoes.length === 0
            ? styles.listaVazia
            : styles.lista
        }
        ListHeaderComponent={
          doacoes.length > 0 ? (
            <View>
              <Text style={styles.titulo}>
                Minhas doações
              </Text>

              <TextInput
                style={styles.busca}
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar por tipo de item"
                placeholderTextColor="#888888"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          doacoes.length === 0 ? (
            <View style={styles.vazio}>
              <Text style={styles.tituloVazio}>
                Nenhuma doação cadastrada
              </Text>

              <Text style={styles.mensagem}>
                Cadastre uma doação para começar o histórico.
              </Text>

              <TouchableOpacity
                style={styles.botao}
                onPress={() =>
                  navigation.navigate('Cadastro')
                }
              >
                <Text style={styles.textoBotao}>
                  Cadastrar doação
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.semResultado}>
              <Text style={styles.tituloVazio}>
                Nenhuma doação encontrada
              </Text>

              <Text style={styles.mensagem}>
                Nenhum tipo de item corresponde a "{busca}".
              </Text>
            </View>
          )
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

  busca: {
    width: '100%',
    minHeight: 44,
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#222222',
  },

  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  semResultado: {
    paddingVertical: 32,
    alignItems: 'center',
  },

  tituloVazio: {
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B3A5C',
    textAlign: 'center',
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
    alignItems: 'center',
  },

  textoBotao: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
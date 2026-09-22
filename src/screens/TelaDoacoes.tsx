import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  carregarDoacoes,
  DoacaoRegistrada,
  removerDoacao,
} from '../storage/doacoesStorage';

export function TelaDoacoes() {
  const [doacoes, setDoacoes] = useState<DoacaoRegistrada[]>([]);
  const [carregando, setCarregando] = useState(true);

  async function atualizarDoacoes() {
    try {
      setCarregando(true);

      const dados = await carregarDoacoes();

      setDoacoes([...dados].reverse());
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível carregar as doações.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      atualizarDoacoes();
    }, [])
  );

  function confirmarExclusao(doacao: DoacaoRegistrada) {
    Alert.alert(
      'Excluir doação',
      `Deseja excluir a doação de ${doacao.item}?`,
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
              await removerDoacao(doacao.id);
              await atualizarDoacoes();
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

  function formatarData(data: string) {
    return new Date(data).toLocaleString('pt-BR');
  }

  if (carregando) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={['bottom', 'left', 'right']}
      >
        <View style={styles.centro}>
          <Text style={styles.mensagem}>
            Carregando doações...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['bottom', 'left', 'right']}
    >
      <FlatList
        data={doacoes}
        keyExtractor={(doacao) => doacao.id}
        contentContainerStyle={
          doacoes.length === 0
            ? styles.listaVazia
            : styles.lista
        }
        ListHeaderComponent={
          doacoes.length > 0 ? (
            <View style={styles.cabecalho}>
              <Text style={styles.titulo}>
                Doações registradas
              </Text>

              <Text style={styles.contador}>
                {doacoes.length}{' '}
                {doacoes.length === 1
                  ? 'doação registrada'
                  : 'doações registradas'}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.centro}>
            <Text style={styles.titulo}>
              Nenhuma doação
            </Text>

            <Text style={styles.mensagem}>
              As doações cadastradas aparecerão aqui.
            </Text>
          </View>
        }
        renderItem={({ item: doacao }) => (
          <View style={styles.card}>
            <Text style={styles.item}>
              {doacao.item}
            </Text>

            <Text style={styles.informacao}>
              Doador: {doacao.nome}
            </Text>

            <Text style={styles.informacao}>
              Quantidade: {doacao.quantidade}
            </Text>

            {doacao.observacao ? (
              <Text style={styles.informacao}>
                Observação: {doacao.observacao}
              </Text>
            ) : null}

            <Text style={styles.data}>
              {formatarData(doacao.data)}
            </Text>

            <TouchableOpacity
              style={styles.botaoExcluir}
              onPress={() => confirmarExclusao(doacao)}
            >
              <Text style={styles.textoExcluir}>
                Excluir
              </Text>
            </TouchableOpacity>
          </View>
        )}
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

  cabecalho: {
    marginBottom: 16,
  },

  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },

  contador: {
    marginTop: 4,
    fontSize: 14,
    color: '#666666',
  },

  mensagem: {
    marginTop: 8,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },

  card: {
    marginBottom: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  item: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },

  informacao: {
    marginBottom: 4,
    fontSize: 15,
    color: '#333333',
  },

  data: {
    marginTop: 8,
    fontSize: 13,
    color: '#777777',
  },

  botaoExcluir: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#C62828',
  },

  textoExcluir: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
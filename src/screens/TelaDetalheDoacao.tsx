import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAvisos } from '../contexts/AvisosContext';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  excluirDoacao,
  listarDoacoes,
} from '../services/doacoesStorage';

import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'DetalheDoacao'
>;

export function TelaDetalheDoacao({
  route,
  navigation,
}: Props) {
  const { avisar, confirmar } = useAvisos();
  const trava = useRef(false);
  const [excluindo, setExcluindo] = useState(false);
  const doacaoInicial = route.params.doacao;

  const [doacao, setDoacao] = useState(doacaoInicial);

  useFocusEffect(
    useCallback(() => {
      async function atualizarDetalhe() {
        const doacoes = await listarDoacoes();

        const atualizada = doacoes.find(
          (item) => item.id === doacaoInicial.id
        );

        if (atualizada) {
          setDoacao(atualizada);
        }
      }

      void atualizarDetalhe().catch(() => { void avisar('Erro', 'Não foi possível carregar a doação.'); });
    }, [doacaoInicial.id, avisar])
  );

  async function confirmarExclusao() {
    if (trava.current) return;
    trava.current = true; setExcluindo(true);
    try {
      if (!await confirmar('Excluir doação', `Deseja excluir a doação de “${doacao.tipoItem}”?`)) return;
      await excluirDoacao(doacao.id);
      await avisar('Sucesso', `Doação de “${doacao.tipoItem}” excluída.`);
      navigation.goBack();
    } catch {
      await avisar('Erro', 'Não foi possível excluir a doação. Tente novamente.');
    } finally { trava.current = false; setExcluindo(false); }
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
          accessibilityRole="button"
          disabled={excluindo}
          style={styles.botaoEditar}
          onPress={() =>
            navigation.navigate('Cadastro', {
              doacao,
            })
          }
        >
          <Text style={styles.textoEditar}>
            Editar doação
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          disabled={excluindo}
          style={styles.botaoExcluir}
          onPress={() => { void confirmarExclusao(); }}
        >
          <Text style={styles.textoExcluir}>
            {excluindo ? 'Aguarde...' : 'Excluir doação'}
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

  botaoEditar: {
    minHeight: 44,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#1B3A5C',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoEditar: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  botaoExcluir: {
    minHeight: 44,
    marginTop: 12,
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
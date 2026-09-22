import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { carregarDoacao, salvarDoacao } from '../storage/doacaoStorage';
import { registrarDoacao } from '../storage/doacoesStorage';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

export function TelaCadastroDoacao({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [item, setItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    async function recuperarUltimaDoacao() {
      try {
        const doacao = await carregarDoacao();

        if (doacao) {
          setNome(doacao.nome);
          setItem(doacao.item);
          setQuantidade(doacao.quantidade);
          setObservacao(doacao.observacao);
        }
      } catch {
        Alert.alert(
          'Erro',
          'Não foi possível recuperar a última doação salva.'
        );
      }
    }

    recuperarUltimaDoacao();
  }, []);

  async function criarDoacao() {
    if (!nome.trim() || !item.trim() || !quantidade.trim()) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha nome, item e quantidade.'
      );

      return;
    }

    const dados = {
      nome: nome.trim(),
      item: item.trim(),
      quantidade: quantidade.trim(),
      observacao: observacao.trim(),
    };

    try {
      await salvarDoacao(dados);

      await registrarDoacao(dados);

      Alert.alert(
        'Doação criada',
        'A doação foi registrada neste aparelho.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível salvar os dados da doação.'
      );
    }
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['bottom', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.formulario}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>
            Cadastrar doação
          </Text>

          <Text style={styles.rotulo}>
            Nome do doador
          </Text>

          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome"
            returnKeyType="next"
          />

          <Text style={styles.rotulo}>
            Item para doação
          </Text>

          <TextInput
            style={styles.input}
            value={item}
            onChangeText={setItem}
            placeholder="Ex.: arroz, roupas, cobertores"
            returnKeyType="next"
          />

          <Text style={styles.rotulo}>
            Quantidade
          </Text>

          <TextInput
            style={styles.input}
            value={quantidade}
            onChangeText={setQuantidade}
            placeholder="Digite a quantidade"
            keyboardType="numeric"
            returnKeyType="next"
          />

          <Text style={styles.rotulo}>
            Observações
          </Text>

          <TextInput
            style={[styles.input, styles.inputMultilinha]}
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Informações adicionais"
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={criarDoacao}
          >
            <Text style={styles.textoBotao}>
              Criar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoDoacoes}
            onPress={() => navigation.navigate('Doacoes')}
          >
            <Text style={styles.textoBotaoDoacoes}>
              Ver doações cadastradas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  keyboardView: {
    flex: 1,
  },

  formulario: {
    padding: 20,
    paddingBottom: 40,
  },

  titulo: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },

  rotulo: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },

  input: {
    width: '100%',
    minHeight: 44,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#222222',
  },

  inputMultilinha: {
    minHeight: 100,
  },

  botao: {
    width: '100%',
    minHeight: 44,
    marginBottom: 12,
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

  botaoDoacoes: {
    width: '100%',
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1B3A5C',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoBotaoDoacoes: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
});
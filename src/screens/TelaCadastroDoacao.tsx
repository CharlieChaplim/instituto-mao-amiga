import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

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

import {
  atualizarDoacao,
  salvarDoacao,
} from '../storage/doacoesStorage';

import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Cadastro'
>;

export function TelaCadastroDoacao({
  navigation,
  route,
}: Props) {
  const doacaoEmEdicao = route.params?.doacao;

  const [tipoItem, setTipoItem] = useState(
    doacaoEmEdicao?.tipoItem ?? ''
  );

  const [quantidade, setQuantidade] = useState(
    doacaoEmEdicao
      ? String(doacaoEmEdicao.quantidade)
      : ''
  );

  const [pontoDestino, setPontoDestino] = useState(
    doacaoEmEdicao?.pontoDestino ?? ''
  );

  async function cadastrarDoacao() {
    if (
      !tipoItem.trim() ||
      !quantidade.trim() ||
      !pontoDestino.trim()
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha todos os campos.'
      );

      return;
    }

    if (
      !/^\d+$/.test(quantidade.trim()) ||
      Number(quantidade) <= 0
    ) {
      Alert.alert(
        'Quantidade inválida',
        'Informe uma quantidade inteira maior que zero.'
      );

      return;
    }

    try {
      if (doacaoEmEdicao) {
        await atualizarDoacao({
          ...doacaoEmEdicao,
          tipoItem: tipoItem.trim(),
          quantidade: Number(quantidade),
          pontoDestino: pontoDestino.trim(),
        });

        Alert.alert(
          'Doação atualizada',
          'As alterações foram salvas.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );

        return;
      }

      await salvarDoacao({
        tipoItem: tipoItem.trim(),
        quantidade: Number(quantidade),
        pontoDestino: pontoDestino.trim(),
      });

      Alert.alert(
        'Doação registrada',
        'A doação foi salva neste aparelho.',
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
        doacaoEmEdicao
          ? 'Não foi possível atualizar a doação.'
          : 'Não foi possível salvar a doação.'
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
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        <ScrollView
          contentContainerStyle={styles.formulario}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>
            {doacaoEmEdicao
              ? 'Editar doação'
              : 'Cadastrar doação'}
          </Text>

          <Text style={styles.rotulo}>
            Tipo do item
          </Text>

          <TextInput
            style={styles.input}
            value={tipoItem}
            onChangeText={setTipoItem}
            placeholder="Ex.: roupas, alimentos"
            returnKeyType="next"
          />

          <Text style={styles.rotulo}>
            Quantidade
          </Text>

          <TextInput
            style={styles.input}
            value={quantidade}
            onChangeText={setQuantidade}
            placeholder="Ex.: 5"
            keyboardType="numeric"
            returnKeyType="next"
          />

          <Text style={styles.rotulo}>
            Ponto de destino
          </Text>

          <TextInput
            style={styles.input}
            value={pontoDestino}
            onChangeText={setPontoDestino}
            placeholder="Ex.: Ponto Centro"
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={cadastrarDoacao}
          >
            <Text style={styles.textoBotao}>
              {doacaoEmEdicao
                ? 'Salvar alterações'
                : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          {doacaoEmEdicao ? (
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>
          ) : null}
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
    marginBottom: 20,
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

  botao: {
    width: '100%',
    minHeight: 44,
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

  botaoCancelar: {
    width: '100%',
    minHeight: 44,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoCancelar: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555555',
  },
});
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  atendimento: string;
};

type RootStackParamList = {
  Lista: undefined;
  Detalhe: { pontoId: string };
  Cadastro: undefined;
};

type ListaProps = NativeStackScreenProps<RootStackParamList, 'Lista'>;
type DetalheProps = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;
type CadastroProps = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Mercado Central',
    endereco: 'Av. Goiás, 1.000 - Setor Central, Goiânia - GO',
    horario: 'Segunda a sexta, das 8h às 17h',
    atendimento: 'Recebe alimentos não perecíveis e produtos de higiene.',
  },
  {
    id: '2',
    nome: 'Centro Comunitário Esperança',
    endereco: 'Rua T-30, 450 - Setor Bueno, Goiânia - GO',
    horario: 'Terça e quinta, das 9h às 16h; sábado, das 9h às 12h',
    atendimento: 'Distribui cestas básicas e roupas para famílias cadastradas.',
  },
  {
    id: '3',
    nome: 'Feira Solidária do Bairro',
    endereco: 'Rua 10, 280 - Setor Oeste, Goiânia - GO',
    horario: 'Quarta e sábado, das 7h às 13h',
    atendimento: 'Recebe frutas, verduras e roupas em bom estado.',
  },
  {
    id: '4',
    nome: 'Igreja São Lucas',
    endereco: 'Av. T-9, 1.725 - Jardim América, Goiânia - GO',
    horario: 'Segunda, quarta e sexta, das 13h às 18h',
    atendimento: 'Recebe roupas, cobertores, calçados e itens de higiene pessoal.',
  },
  {
    id: '5',
    nome: 'Associação Viver Melhor',
    endereco: 'Av. Anhanguera, 6.350 - Setor Campinas, Goiânia - GO',
    horario: 'Terça a sexta, das 10h às 17h',
    atendimento: 'Distribui alimentos, kits de higiene e roupas infantis.',
  },
  {
    id: '6',
    nome: 'Escola Comunitária Horizonte',
    endereco: 'Rua 84, 620 - Setor Sul, Goiânia - GO',
    horario: 'Segunda a sexta, das 7h30 às 11h30',
    atendimento: 'Recebe leite, alimentos infantis e materiais escolares.',
  },
  {
    id: '7',
    nome: 'Centro de Apoio Nova Vida',
    endereco: 'Av. 24 de Outubro, 1.180 - Setor Campinas, Goiânia - GO',
    horario: 'Segunda, terça e quinta, das 8h às 15h',
    atendimento: 'Distribui cestas básicas, roupas adultas e produtos de limpeza.',
  },
  {
    id: '8',
    nome: 'Ponto Solidário Universitário',
    endereco: 'Av. Universitária, 1.440 - Setor Leste Universitário, Goiânia - GO',
    horario: 'Quarta e sexta, das 9h às 19h',
    atendimento: 'Recebe alimentos não perecíveis, livros e roupas em bom estado.',
  },
];

function PontoItem({ ponto, onPress }: { ponto: Ponto; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.nomeItem}>{ponto.nome}</Text>
      <Text style={styles.enderecoItem}>{ponto.endereco}</Text>
      <Text style={styles.abrir}>Toque para ver detalhes</Text>
    </TouchableOpacity>
  );
}

function TelaListaPontos({ navigation }: ListaProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.containerLista}>
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

              {/* O botão faz parte da lista. Ao rolar para baixo ele sai da tela naturalmente. */}
              <TouchableOpacity
                style={styles.botaoCriar}
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

function ItemDetalhe({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.detalhe}>
      <Text style={styles.nomeDetalhe}>{ponto.nome}</Text>

      <Text style={styles.rotulo}>Endereço</Text>
      <Text style={styles.texto}>{ponto.endereco}</Text>

      <Text style={styles.rotulo}>Dias e horários</Text>
      <Text style={styles.texto}>{ponto.horario}</Text>

      <Text style={styles.rotulo}>O que recebe ou distribui</Text>
      <Text style={styles.texto}>{ponto.atendimento}</Text>
    </View>
  );
}

function TelaDetalhePonto({ route }: DetalheProps) {
  const { pontoId } = route.params;
  const ponto = pontosMock.find((item) => item.id === pontoId);

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudoScroll}
      >
        <ItemDetalhe ponto={ponto} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TelaCadastroDoacao({ navigation }: CadastroProps) {
  const [nome, setNome] = useState('');
  const [item, setItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');

  function criarDoacao() {
    if (!nome.trim() || !item.trim() || !quantidade.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, item e quantidade.');
      return;
    }

    Alert.alert('Doação criada', 'Os dados da doação foram preenchidos com sucesso.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.formulario}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>Cadastrar doação</Text>
          <Text style={styles.descricaoFormulario}>
            Preencha os dados abaixo. Em telas menores, role a página para acessar todos os campos.
          </Text>

          <Text style={styles.rotuloCampo}>Nome do doador</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite o nome"
            returnKeyType="next"
          />

          <Text style={styles.rotuloCampo}>Item para doação</Text>
          <TextInput
            style={styles.input}
            value={item}
            onChangeText={setItem}
            placeholder="Ex.: arroz, roupas, cobertores"
            returnKeyType="next"
          />

          <Text style={styles.rotuloCampo}>Quantidade</Text>
          <TextInput
            style={styles.input}
            value={quantidade}
            onChangeText={setQuantidade}
            placeholder="Digite a quantidade"
            keyboardType="numeric"
            returnKeyType="next"
          />

          <Text style={styles.rotuloCampo}>Observações</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinha]}
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Informações adicionais"
            multiline
            textAlignVertical="top"
          />

          {/* O botão fica no fluxo da página e também pode ser alcançado por rolagem. */}
          <TouchableOpacity style={styles.botaoCriar} onPress={criarDoacao}>
            <Text style={styles.textoBotao}>Criar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen
          name="Lista"
          component={TelaListaPontos}
          options={{ title: 'Instituto Mão Amiga' }}
        />
        <Stack.Screen
          name="Detalhe"
          component={TelaDetalhePonto}
          options={{ title: 'Detalhe do ponto' }}
        />
        <Stack.Screen
          name="Cadastro"
          component={TelaCadastroDoacao}
          options={{ title: 'Cadastro de doação' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
  scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  containerLista: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  lista: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  conteudoScroll: {
    padding: 20,
    paddingBottom: 32,
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
  descricaoFormulario: {
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 20,
    color: '#555555',
  },
  botaoCriar: {
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
  item: {
    minHeight: 44,
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#F3F5F7',
    borderRadius: 8,
  },
  nomeItem: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  enderecoItem: {
    marginTop: 4,
    fontSize: 14,
    color: '#555555',
  },
  abrir: {
    marginTop: 8,
    fontSize: 13,
    color: '#2E7D32',
  },
  detalhe: {
    width: '100%',
    padding: 16,
    backgroundColor: '#F3F5F7',
    borderRadius: 8,
  },
  nomeDetalhe: {
    marginBottom: 14,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  rotulo: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  texto: {
    marginTop: 3,
    fontSize: 15,
    lineHeight: 21,
    color: '#333333',
  },
  rotuloCampo: {
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
});

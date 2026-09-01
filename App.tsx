import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
  CadastroDoacao: undefined;
};

type ListaProps = NativeStackScreenProps<RootStackParamList, 'Lista'>;
type DetalheProps = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;
type CadastroProps = NativeStackScreenProps<
  RootStackParamList,
  'CadastroDoacao'
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Mercado Central',
    endereco: 'Av. Goiás, 1.000 - Setor Central, Goiânia - GO',
    horario: 'Segunda a sexta, das 8h às 17h',
    atendimento:
      'Recebe alimentos não perecíveis e produtos de higiene.',
  },
  {
    id: '2',
    nome: 'Centro Comunitário Esperança',
    endereco: 'Rua T-30, 450 - Setor Bueno, Goiânia - GO',
    horario: 'Terça e quinta, das 9h às 16h; sábado, das 9h às 12h',
    atendimento:
      'Distribui cestas básicas e roupas para famílias cadastradas.',
  },
  {
    id: '3',
    nome: 'Feira Solidária do Bairro',
    endereco: 'Rua 10, 280 - Setor Oeste, Goiânia - GO',
    horario: 'Quarta e sábado, das 7h às 13h',
    atendimento:
      'Recebe frutas, verduras e roupas em bom estado.',
  },
  {
    id: '4',
    nome: 'Igreja São Lucas',
    endereco: 'Av. T-9, 1.725 - Jardim América, Goiânia - GO',
    horario: 'Segunda, quarta e sexta, das 13h às 18h',
    atendimento:
      'Recebe roupas, cobertores, calçados e itens de higiene pessoal.',
  },
  {
    id: '5',
    nome: 'Associação Viver Melhor',
    endereco: 'Av. Anhanguera, 6.350 - Setor Campinas, Goiânia - GO',
    horario: 'Terça a sexta, das 10h às 17h',
    atendimento:
      'Distribui alimentos, kits de higiene e roupas infantis.',
  },
  {
    id: '6',
    nome: 'Escola Comunitária Horizonte',
    endereco: 'Rua 84, 620 - Setor Sul, Goiânia - GO',
    horario: 'Segunda a sexta, das 7h30 às 11h30',
    atendimento:
      'Recebe leite, alimentos infantis e materiais escolares.',
  },
  {
    id: '7',
    nome: 'Centro de Apoio Nova Vida',
    endereco:
      'Av. 24 de Outubro, 1.180 - Setor Campinas, Goiânia - GO',
    horario: 'Segunda, terça e quinta, das 8h às 15h',
    atendimento:
      'Distribui cestas básicas, roupas adultas e produtos de limpeza.',
  },
  {
    id: '8',
    nome: 'Ponto Solidário Universitário',
    endereco:
      'Av. Universitária, 1.440 - Setor Leste Universitário, Goiânia - GO',
    horario: 'Quarta e sexta, das 9h às 19h',
    atendimento:
      'Recebe alimentos não perecíveis, livros e roupas em bom estado.',
  },
];

function PontoItem({
  ponto,
  onPress,
}: {
  ponto: Ponto;
  onPress: () => void;
}) {
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
    <View style={styles.container}>
      <Text style={styles.titulo}>Pontos de coleta e distribuição</Text>

      <TouchableOpacity
        style={styles.botaoCadastro}
        onPress={() => navigation.navigate('CadastroDoacao')}
      >
        <Text style={styles.textoBotao}>Cadastrar doação</Text>
      </TouchableOpacity>

      <FlatList
        data={pontosMock}
        keyExtractor={(ponto) => ponto.id}
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            onPress={() =>
              navigation.navigate('Detalhe', { pontoId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.lista}
      />
    </View>
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
      <View style={styles.container}>
        <Text style={styles.titulo}>Ponto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ItemDetalhe ponto={ponto} />
    </View>
  );
}

function TelaCadastroDoacao({}: CadastroProps) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');

  const [erroTipo, setErroTipo] = useState('');
  const [erroQuantidade, setErroQuantidade] = useState('');
  const [erroPonto, setErroPonto] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  function validarFormulario() {
    setErroTipo('');
    setErroQuantidade('');
    setErroPonto('');
    setMensagemSucesso('');

    let valido = true;

    if (tipoItem.trim() === '') {
      setErroTipo('Informe o tipo do item.');
      valido = false;
    }

    if (quantidade.trim() === '') {
      setErroQuantidade('Informe a quantidade.');
      valido = false;
    } else {
      const quantidadeNumero = Number(quantidade);

      if (
        Number.isNaN(quantidadeNumero) ||
        !Number.isInteger(quantidadeNumero) ||
        quantidadeNumero <= 0
      ) {
        setErroQuantidade(
          'A quantidade deve ser um número inteiro maior que zero.'
        );
        valido = false;
      }
    }

    if (pontoDestino.trim() === '') {
      setErroPonto('Informe o ponto de destino.');
      valido = false;
    }

    if (valido) {
      setMensagemSucesso(
        'Dados válidos. O salvamento da doação será implementado em uma aula futura.'
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de doação</Text>

      <Text style={styles.rotuloFormulario}>Tipo do item</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: arroz, roupa, cobertor"
        value={tipoItem}
        onChangeText={setTipoItem}
      />
      {erroTipo !== '' && <Text style={styles.erro}>{erroTipo}</Text>}

      <Text style={styles.rotuloFormulario}>Quantidade</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 10"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />
      {erroQuantidade !== '' && (
        <Text style={styles.erro}>{erroQuantidade}</Text>
      )}

      <Text style={styles.rotuloFormulario}>Ponto de destino</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Mercado Central"
        value={pontoDestino}
        onChangeText={setPontoDestino}
      />
      {erroPonto !== '' && <Text style={styles.erro}>{erroPonto}</Text>}

      <TouchableOpacity
        style={styles.botaoValidar}
        onPress={validarFormulario}
      >
        <Text style={styles.textoBotao}>Validar cadastro</Text>
      </TouchableOpacity>

      {mensagemSucesso !== '' && (
        <Text style={styles.sucesso}>{mensagemSucesso}</Text>
      )}
    </View>
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
          name="CadastroDoacao"
          component={TelaCadastroDoacao}
          options={{ title: 'Cadastro de doação' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  lista: {
    paddingBottom: 20,
  },
  titulo: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  item: {
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
  botaoCadastro: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#1B3A5C',
    alignItems: 'center',
  },
  botaoValidar: {
    marginTop: 22,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rotuloFormulario: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  erro: {
    marginTop: 6,
    fontSize: 14,
    color: '#B00020',
  },
  sucesso: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: '#2E7D32',
  },
});

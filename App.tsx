import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
};

type ListaProps = NativeStackScreenProps<RootStackParamList, 'Lista'>;
type DetalheProps = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Mercado Central',
    endereco: 'Av. Anhanguera, 1200 - Setor Central',
    horario: 'Segunda a sexta, das 8h às 17h',
    atendimento: 'Recebe alimentos não perecíveis e produtos de higiene.',
  },
  {
    id: '2',
    nome: 'Centro Comunitário Esperança',
    endereco: 'Rua das Flores, 245 - Jardim América',
    horario: 'Terça, quinta e sábado, das 9h às 16h',
    atendimento: 'Distribui cestas básicas e roupas para famílias cadastradas.',
  },
  {
    id: '3',
    nome: 'Feira Solidária do Bairro',
    endereco: 'Praça da União, 80 - Vila Nova',
    horario: 'Quarta e sábado, das 7h às 13h',
    atendimento: 'Recebe frutas, verduras e roupas em bom estado.',
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Pontos de coleta e distribuição</Text>

      {pontosMock.map((ponto) => (
        <PontoItem
          key={ponto.id}
          ponto={ponto}
          onPress={() => navigation.navigate('Detalhe', { pontoId: ponto.id })}
        />
      ))}
    </ScrollView>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
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
    color: '#333333',
  },
});

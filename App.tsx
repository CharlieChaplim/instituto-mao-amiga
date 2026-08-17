import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Ponto = { id: string; nome: string; endereco: string; horario: string; atendimento: string };
type RootStackParamList = { Lista: undefined; Detalhe: { pontoId: string } };
type ListaProps = NativeStackScreenProps<RootStackParamList, 'Lista'>;
type DetalheProps = NativeStackScreenProps<RootStackParamList, 'Detalhe'>;
const Stack = createNativeStackNavigator<RootStackParamList>();

const pontosMock: Ponto[] = [
  { id: '1', nome: 'Mercado Central', endereco: 'Av. Goiás, 1.000 - Setor Central, Goiânia - GO', horario: 'Segunda a sexta, das 8h às 17h', atendimento: 'Recebe alimentos não perecíveis e produtos de higiene.' },
  { id: '2', nome: 'Centro Comunitário Esperança', endereco: 'Rua T-30, 450 - Setor Bueno, Goiânia - GO', horario: 'Terça e quinta, das 9h às 16h; sábado, das 9h às 12h', atendimento: 'Distribui cestas básicas e roupas para famílias cadastradas.' },
  { id: '3', nome: 'Feira Solidária do Bairro', endereco: 'Rua 10, 280 - Setor Oeste, Goiânia - GO', horario: 'Quarta e sábado, das 7h às 13h', atendimento: 'Recebe frutas, verduras e roupas em bom estado.' },
  { id: '4', nome: 'Igreja São Lucas', endereco: 'Av. T-9, 1.725 - Jardim América, Goiânia - GO', horario: 'Segunda, quarta e sexta, das 13h às 18h', atendimento: 'Recebe roupas, cobertores, calçados e itens de higiene pessoal.' },
  { id: '5', nome: 'Associação Viver Melhor', endereco: 'Av. Anhanguera, 6.350 - Setor Campinas, Goiânia - GO', horario: 'Terça a sexta, das 10h às 17h', atendimento: 'Distribui alimentos, kits de higiene e roupas infantis.' },
  { id: '6', nome: 'Escola Comunitária Horizonte', endereco: 'Rua 84, 620 - Setor Sul, Goiânia - GO', horario: 'Segunda a sexta, das 7h30 às 11h30', atendimento: 'Recebe leite, alimentos infantis e materiais escolares.' },
  { id: '7', nome: 'Centro de Apoio Nova Vida', endereco: 'Av. 24 de Outubro, 1.180 - Setor Campinas, Goiânia - GO', horario: 'Segunda, terça e quinta, das 8h às 15h', atendimento: 'Distribui cestas básicas, roupas adultas e produtos de limpeza.' },
  { id: '8', nome: 'Ponto Solidário Universitário', endereco: 'Av. Universitária, 1.440 - Setor Leste Universitário, Goiânia - GO', horario: 'Quarta e sexta, das 9h às 19h', atendimento: 'Recebe alimentos não perecíveis, livros e roupas em bom estado.' },
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
    <View style={styles.container}>
      <Text style={styles.titulo}>Pontos de coleta e distribuição</Text>
      <FlatList
        data={pontosMock}
        keyExtractor={(ponto) => ponto.id}
        renderItem={({ item }) => (
          <PontoItem ponto={item} onPress={() => navigation.navigate('Detalhe', { pontoId: item.id })} />
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
  if (!ponto) return <View style={styles.container}><Text style={styles.titulo}>Ponto não encontrado.</Text></View>;
  return <View style={styles.container}><ItemDetalhe ponto={ponto} /></View>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen name="Lista" component={TelaListaPontos} options={{ title: 'Instituto Mão Amiga' }} />
        <Stack.Screen name="Detalhe" component={TelaDetalhePonto} options={{ title: 'Detalhe do ponto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  lista: { paddingBottom: 20 },
  titulo: { marginBottom: 16, fontSize: 22, fontWeight: 'bold', color: '#1B3A5C' },
  item: { marginBottom: 12, padding: 14, backgroundColor: '#F3F5F7', borderRadius: 8 },
  nomeItem: { fontSize: 17, fontWeight: 'bold', color: '#1B3A5C' },
  enderecoItem: { marginTop: 4, fontSize: 14, color: '#555555' },
  abrir: { marginTop: 8, fontSize: 13, color: '#2E7D32' },
  detalhe: { padding: 16, backgroundColor: '#F3F5F7', borderRadius: 8 },
  nomeDetalhe: { marginBottom: 14, fontSize: 20, fontWeight: 'bold', color: '#1B3A5C' },
  rotulo: { marginTop: 10, fontSize: 14, fontWeight: 'bold', color: '#2E7D32' },
  texto: { marginTop: 3, fontSize: 15, lineHeight: 21, color: '#333333' },
});

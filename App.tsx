import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  atendimento: string;
};

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

function PontoItem({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.item}>
      <Text style={styles.nomeItem}>{ponto.nome}</Text>
      <Text style={styles.enderecoItem}>{ponto.endereco}</Text>
    </View>
  );
}

function TelaListaPontos() {
  return (
    <View style={styles.bloco}>
      <Text style={styles.titulo}>Pontos de coleta e distribuição</Text>

      {pontosMock.map((ponto) => (
        <PontoItem key={ponto.id} ponto={ponto} />
      ))}
    </View>
  );
}

function DetalhePonto({ ponto }: { ponto: Ponto }) {
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

function TelaDetalhePonto() {
  const pontoMock = pontosMock[0];

  return (
    <View style={styles.bloco}>
      <Text style={styles.titulo}>Detalhe do ponto</Text>
      <DetalhePonto ponto={pontoMock} />
    </View>
  );
}

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TelaListaPontos />
      <TelaDetalhePonto />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
  },
  bloco: {
    marginBottom: 28,
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

import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';

const produtosMock = [
  {
    id: '1',
    nome: 'Cadeira Confort Plus',
    preco: 'R$ 349,90',
    categoria: 'Móveis',
    imagem: 'https://picsum.photos/seed/cadeira/200',
  },
  {
    id: '2',
    nome: 'Mesa para Escritório Compacta',
    preco: 'R$ 589,00',
    categoria: 'Móveis',
    imagem: 'https://picsum.photos/seed/mesa/200',
  },
  {
    id: '3',
    nome: 'Luminária de Mesa LED',
    preco: 'R$ 79,90',
    categoria: 'Iluminação',
    imagem: 'https://picsum.photos/seed/luminaria/200',
  },
  {
    id: '4',
    nome: 'Suporte para Notebook',
    preco: 'R$ 129,90',
    categoria: 'Acessórios',
    imagem: 'https://picsum.photos/seed/notebook/200',
  },
];

function ProdutoItem({ produto, categoria }) {
  const [favorito, setFavorito] = useState(false);
  const [quantidade, setQuantidade] = useState(0);

  function diminuirQuantidade() {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  }

  return (
    <View style={styles.item}>
      <Image
        source={{ uri: produto.imagem }}
        style={styles.imagem}
      />

      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.categoria}>{categoria}</Text>
        <Text style={styles.preco}>{produto.preco}</Text>

        <View style={styles.quantidade}>
          <Button
            title="-"
            onPress={diminuirQuantidade}
            disabled={quantidade === 0}
          />

          <Text style={styles.numero}>{quantidade}</Text>

          <Button
            title="+"
            onPress={() => setQuantidade(quantidade + 1)}
          />
        </View>
      </View>

      <Button
        title={favorito ? '♥' : '♡'}
        onPress={() => setFavorito(!favorito)}
      />
    </View>
  );
}

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Loja Compre Bem</Text>

      {produtosMock.map((produto) => (
        <ProdutoItem
          key={produto.id}
          produto={produto}
          categoria={produto.categoria}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    marginBottom: 24,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  imagem: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  categoria: {
    marginTop: 2,
    fontSize: 13,
    color: '#666666',
  },
  preco: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
  },
  quantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  numero: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
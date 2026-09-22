import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ponto } from '../types/Ponto';

type Props = {
  ponto: Ponto;
  onPress: () => void;
};

export function PontoItem({ ponto, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.endereco}>{ponto.endereco}</Text>
      <Text style={styles.abrir}>Toque para ver detalhes</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 44,
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#F3F5F7',
    borderRadius: 8,
  },
  nome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  endereco: {
    marginTop: 4,
    fontSize: 14,
    color: '#555555',
  },
  abrir: {
    marginTop: 8,
    fontSize: 13,
    color: '#2E7D32',
  },
});

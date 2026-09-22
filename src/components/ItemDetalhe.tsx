import { StyleSheet, Text, View } from 'react-native';
import { Ponto } from '../types/Ponto';

export function ItemDetalhe({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.detalhe}>
      <Text style={styles.nome}>{ponto.nome}</Text>

      <Text style={styles.rotulo}>Endereço</Text>
      <Text style={styles.texto}>{ponto.endereco}</Text>

      <Text style={styles.rotulo}>Dias e horários</Text>
      <Text style={styles.texto}>{ponto.horario}</Text>

      <Text style={styles.rotulo}>O que recebe ou distribui</Text>
      <Text style={styles.texto}>{ponto.atendimento}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detalhe: {
    width: '100%',
    padding: 16,
    backgroundColor: '#F3F5F7',
    borderRadius: 8,
  },
  nome: {
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
});

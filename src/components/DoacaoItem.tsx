import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Doacao } from '../types/Doacao';

type Props = {
  doacao: Doacao;
};

function DoacaoItemComponent({ doacao }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.tipo}>
        {doacao.tipoItem}
      </Text>

      <Text style={styles.texto}>
        Quantidade: {doacao.quantidade}
      </Text>

      <Text style={styles.texto}>
        Destino: {doacao.pontoDestino}
      </Text>

      <Text style={styles.data}>
        {new Date(doacao.criadoEm).toLocaleString('pt-BR')}
      </Text>
    </View>
  );
}

export const DoacaoItem = memo(DoacaoItemComponent);

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  tipo: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },

  texto: {
    marginBottom: 4,
    fontSize: 15,
    color: '#333333',
  },

  data: {
    marginTop: 8,
    fontSize: 13,
    color: '#777777',
  },
});
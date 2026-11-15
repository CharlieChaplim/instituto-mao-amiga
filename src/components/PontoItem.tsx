import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Ponto } from '../types/Ponto';
type Props = { ponto: Ponto; onPress: () => void; favorito: boolean; onFavorito: () => void; desabilitado?: boolean };
export function PontoItem({ ponto, onPress, favorito, onFavorito, desabilitado }: Props) {
  return <View style={styles.card}>
    <TouchableOpacity accessibilityRole="button" style={styles.detalhe} onPress={onPress}>
      <Text style={styles.nome}>{ponto.nome}</Text><Text>{ponto.endereco}</Text>
      <Text style={styles.link}>Toque para ver detalhes</Text>
    </TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${favorito ? 'Desmarcar' : 'Favoritar'} ${ponto.nome}`}
      accessibilityState={{ selected: favorito, disabled: desabilitado }} disabled={desabilitado}
      style={styles.favorito} onPress={onFavorito}>
      <Text style={styles.coracao}>{favorito ? '♥' : '♡'}</Text>
    </TouchableOpacity>
  </View>;
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderRadius: 8, backgroundColor: '#F3F5F7' },
  detalhe: { flex: 1, padding: 14, minHeight: 44 },
  nome: { fontWeight: 'bold', fontSize: 17, color: '#1B3A5C' },
  link: { color: '#2E7D32', marginTop: 8 },
  favorito: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  coracao: { fontSize: 28, color: '#B71C1C' },
});

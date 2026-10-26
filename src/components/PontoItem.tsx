import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { Ponto } from '../types/ponto';
type Props = { ponto: Ponto; onPress: () => void };
export function PontoItem({ponto,onPress}:Props) { return <TouchableOpacity style={styles.card} onPress={onPress}><Text style={styles.nome}>{ponto.nome}</Text><Text>{ponto.endereco}</Text><Text style={styles.link}>Toque para ver detalhes</Text></TouchableOpacity>; }
const styles=StyleSheet.create({card:{padding:14,marginBottom:12,borderRadius:8,backgroundColor:'#F3F5F7'},nome:{fontWeight:'bold',fontSize:17,color:'#1B3A5C'},link:{color:'#2E7D32',marginTop:8}});

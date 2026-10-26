import { StyleSheet, Text, View } from 'react-native';
import type { Ponto } from '../types/ponto';
export function ItemDetalhe({ponto}:{ponto:Ponto}) {return <View style={styles.box}><Text style={styles.nome}>{ponto.nome}</Text><Text style={styles.rotulo}>Endereço</Text><Text>{ponto.endereco}</Text><Text style={styles.rotulo}>Dias e horários</Text><Text>{ponto.horario}</Text><Text style={styles.rotulo}>Recebe ou distribui</Text><Text>{ponto.atendimento}</Text></View>;}
const styles=StyleSheet.create({box:{padding:16,backgroundColor:'#F3F5F7',borderRadius:8},nome:{fontWeight:'bold',fontSize:20,color:'#1B3A5C'},rotulo:{fontWeight:'bold',marginTop:14,color:'#2E7D32'}});

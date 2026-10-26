import { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { atualizarDoacao, salvarDoacao } from '../services/doacoesStorage';
import { listarPontos } from '../services/pontosService';
import type { Ponto } from '../types/ponto';
import type { RootStackParamList } from '../types/navigation';
type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;
export function TelaCadastroDoacao({ navigation, route }: Props) {
  const editando = route.params?.doacao;
  const [tipoItem, setTipoItem] = useState(editando?.tipoItem ?? '');
  const [quantidade, setQuantidade] = useState(editando ? String(editando.quantidade) : '');
  const [pontoDestino, setPontoDestino] = useState(editando?.pontoDestino ?? '');
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const dados: Ponto[] = [];
        let pagina = 0;
        let total = 1;
        do {
          const resposta = await listarPontos(pagina, 50);
          dados.push(...resposta.content);
          total = resposta.page.totalPages;
          pagina += 1;
        } while (pagina < total);
        if (ativo) setPontos(dados);
      } catch {
        if (ativo) setErro('Não foi possível carregar os destinos. Ligue a API e reabra esta tela.');
      } finally { if (ativo) setCarregando(false); }
    }
    void carregar();
    return () => { ativo = false; };
  }, []);
  async function salvar() {
    const quantidadeNumero = Number(quantidade);
    if (!tipoItem.trim() || !quantidade.trim() || !pontoDestino.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.'); return;
    }
    if (!/^\d+$/.test(quantidade.trim()) || !Number.isSafeInteger(quantidadeNumero) || quantidadeNumero <= 0) {
      Alert.alert('Quantidade inválida', 'Informe uma quantidade inteira maior que zero.'); return;
    }
    if (!editando && !pontos.some(p => p.nome === pontoDestino)) {
      Alert.alert('Destino inválido', 'Selecione um ponto fornecido pela API.'); return;
    }
    try {
      const dados = { tipoItem: tipoItem.trim(), quantidade: quantidadeNumero, pontoDestino };
      if (editando) await atualizarDoacao({ ...editando, ...dados });
      else await salvarDoacao(dados);
      Alert.alert('Sucesso', editando ? 'Doação atualizada.' : 'Doação salva neste aparelho.', [{text:'OK', onPress:() => navigation.goBack()}]);
    } catch { Alert.alert('Erro', 'Não foi possível salvar a doação.'); }
  }
  return <SafeAreaView style={styles.area} edges={['bottom','left','right']}><KeyboardAvoidingView style={styles.area} behavior={Platform.OS === 'ios' ? 'padding':'height'}>
    <ScrollView contentContainerStyle={styles.corpo} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>{editando ? 'Editar doação':'Cadastrar doação'}</Text>
      <Text style={styles.rotulo}>Tipo do item</Text><TextInput style={styles.input} value={tipoItem} onChangeText={setTipoItem} placeholder="Ex.: roupas, alimentos" />
      <Text style={styles.rotulo}>Quantidade</Text><TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" placeholder="Ex.: 5" />
      <Text style={styles.rotulo}>Ponto de destino</Text>
      {editando && !pontos.some(p => p.nome === pontoDestino) ? <Text style={styles.aviso}>Destino salvo anteriormente: {pontoDestino}</Text> : null}
      {carregando ? <ActivityIndicator/> : erro ? <Text style={styles.aviso}>{erro}</Text> : null}
      {pontos.map(p => <TouchableOpacity key={p.id} onPress={() => setPontoDestino(p.nome)} style={[styles.opcao, pontoDestino === p.nome && styles.selecionado]}><Text style={styles.opcaoTexto}>{pontoDestino === p.nome ? '● ' : '○ '}{p.nome}</Text></TouchableOpacity>)}
      <TouchableOpacity style={[styles.botao, (!editando && (carregando || !!erro)) && styles.desabilitado]} disabled={!editando && (carregando || !!erro)} onPress={() => void salvar()}><Text style={styles.botaoTexto}>{editando ? 'Salvar alterações':'Cadastrar'}</Text></TouchableOpacity>
      {editando ? <TouchableOpacity style={styles.cancelar} onPress={() => navigation.goBack()}><Text>Cancelar</Text></TouchableOpacity> : null}
    </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const styles=StyleSheet.create({area:{flex:1,backgroundColor:'#fff'},corpo:{padding:20,paddingBottom:40},titulo:{fontWeight:'bold',fontSize:22,color:'#1B3A5C',marginBottom:20},rotulo:{fontWeight:'bold',color:'#1B3A5C',marginBottom:6},input:{minHeight:44,borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:12,marginBottom:16},opcao:{padding:12,borderWidth:1,borderColor:'#ddd',borderRadius:8,marginBottom:8},selecionado:{backgroundColor:'#E8F5E9',borderColor:'#2E7D32'},opcaoTexto:{fontSize:15,color:'#1B3A5C'},botao:{padding:14,borderRadius:8,backgroundColor:'#2E7D32',alignItems:'center',marginTop:16},botaoTexto:{color:'#fff',fontWeight:'bold'},desabilitado:{opacity:0.5},cancelar:{padding:14,alignItems:'center'},aviso:{color:'#B71C1C',marginBottom:10}});

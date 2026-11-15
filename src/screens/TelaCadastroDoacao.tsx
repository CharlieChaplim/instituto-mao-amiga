import { useEffect, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAvisos } from '../contexts/AvisosContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '../services/api';
import { cadastrarDoacao, buscarDoacaoPorId, editarDoacao } from '../services/doacoesService';
import { listarPontos } from '../services/pontosService';
import type { Ponto } from '../types/Ponto';
import type { RootStackParamList } from '../types/navigation';
type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;
export function TelaCadastroDoacao({ navigation, route }: Props) {
  const doacaoId = route.params?.doacaoId;
  const editando = !!doacaoId;
  const [destinoOriginal, setDestinoOriginal] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const { avisar } = useAvisos();
  const trava = useRef(false);
  const [salvando, setSalvando] = useState(false);
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  useEffect(() => {
    let ativo = true;
    async function carregar() {
      setCarregando(true); setErro('');
      try {
        const [destinos, doacao] = await Promise.all([
          listarPontos(), doacaoId ? buscarDoacaoPorId(doacaoId) : Promise.resolve(null),
        ]);
        if (!ativo) return;
        setPontos(destinos);
        if (doacao) {
          setTipoItem(doacao.tipoItem); setQuantidade(String(doacao.quantidade));
          setPontoDestino(doacao.pontoDestino); setDestinoOriginal(doacao.pontoDestino);
        } else { setTipoItem(''); setQuantidade(''); setPontoDestino(''); setDestinoOriginal(''); }
      } catch (e: unknown) {
        if (ativo) setErro(e instanceof ApiError && e.status === 404
          ? 'Doação não encontrada.' : 'Não foi possível carregar o formulário. Verifique a API e tente novamente.');
      } finally { if (ativo) setCarregando(false); }
    }
    void carregar();
    return () => { ativo = false; };
  }, [doacaoId, tentativa]);
  async function salvar() {
    if (trava.current || carregando || erro) return;
    trava.current = true; setSalvando(true);
    try {
      const quantidadeNumero = Number(quantidade);
      if (!tipoItem.trim() || !quantidade.trim() || !pontoDestino.trim()) {
        await avisar('Campos obrigatórios', 'Preencha todos os campos.'); return;
      }
      if (!/^\d+$/.test(quantidade.trim()) || !Number.isSafeInteger(quantidadeNumero) || quantidadeNumero <= 0) {
        await avisar('Quantidade inválida', 'Informe uma quantidade inteira maior que zero.'); return;
      }
      if (!pontos.some(p => p.nome === pontoDestino) && !(editando && pontoDestino === destinoOriginal)) {
        await avisar('Destino inválido', 'Selecione um ponto fornecido pela API.'); return;
      }
      const dados = { tipoItem: tipoItem.trim(), quantidade: quantidadeNumero, pontoDestino };
      if (doacaoId) await editarDoacao(doacaoId, dados);
      else await cadastrarDoacao(dados);
      await avisar('Sucesso', `Doação de ${quantidadeNumero} unidade(s) de “${dados.tipoItem}” ${editando ? 'atualizada' : 'criada'} com sucesso.`);
      navigation.goBack();
    } catch {
      await avisar('Erro', 'Não foi possível salvar a doação. Seus dados continuam no formulário.');
    } finally { trava.current = false; setSalvando(false); }
  }
  return <SafeAreaView style={styles.area} edges={['bottom','left','right']}><KeyboardAvoidingView style={styles.area} behavior={Platform.OS === 'ios' ? 'padding':'height'}>
    <ScrollView contentContainerStyle={styles.corpo} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>{editando ? 'Editar doação' : 'Cadastrar doação'}</Text>
      <Text style={styles.rotulo}>Tipo do item</Text><TextInput style={styles.input} editable={!salvando && !carregando && !erro} value={tipoItem} onChangeText={setTipoItem} placeholder="Ex.: roupas, alimentos" />
      <Text style={styles.rotulo}>Quantidade</Text><TextInput style={styles.input} editable={!salvando && !carregando && !erro} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" placeholder="Ex.: 5" />
      <Text style={styles.rotulo}>Ponto de destino</Text>
      {carregando ? <><ActivityIndicator/><Text>Carregando formulário...</Text></> : erro ? <><Text style={styles.aviso}>{erro}</Text><TouchableOpacity accessibilityRole="button" style={styles.cancelar} onPress={() => setTentativa(t => t + 1)}><Text>Tentar novamente</Text></TouchableOpacity></> : null}
      {editando && destinoOriginal && !pontos.some(p => p.nome === destinoOriginal) ? <Text>Destino original: {destinoOriginal}. Você pode mantê-lo ou selecionar outro ponto.</Text> : null}
      {!carregando && !erro && pontos.length === 0 ? <Text>Nenhum ponto de destino cadastrado.</Text> : null}
      {pontos.map(p => <TouchableOpacity accessibilityRole="button" disabled={salvando || carregando || !!erro} key={p.id} onPress={() => setPontoDestino(p.nome)} style={[styles.opcao, pontoDestino === p.nome && styles.selecionado]}><Text style={styles.opcaoTexto}>{pontoDestino === p.nome ? '● ' : '○ '}{p.nome}</Text></TouchableOpacity>)}
      <TouchableOpacity style={[styles.botao, (salvando || (carregando || !!erro || (pontos.length === 0 && !destinoOriginal))) && styles.desabilitado]} accessibilityRole="button" disabled={salvando || (carregando || !!erro || (pontos.length === 0 && !destinoOriginal))} onPress={() => void salvar()}><Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar'}</Text></TouchableOpacity>
      {editando ? <TouchableOpacity accessibilityRole="button" style={styles.cancelar} disabled={salvando} onPress={() => navigation.goBack()}><Text>Cancelar</Text></TouchableOpacity> : null}
    </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const styles=StyleSheet.create({area:{flex:1,backgroundColor:'#fff'},corpo:{padding:20,paddingBottom:40},titulo:{fontWeight:'bold',fontSize:22,color:'#1B3A5C',marginBottom:20},rotulo:{fontWeight:'bold',color:'#1B3A5C',marginBottom:6},input:{minHeight:44,borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:12,marginBottom:16},opcao:{padding:12,borderWidth:1,borderColor:'#ddd',borderRadius:8,marginBottom:8},selecionado:{backgroundColor:'#E8F5E9',borderColor:'#2E7D32'},opcaoTexto:{fontSize:15,color:'#1B3A5C'},botao:{padding:14,borderRadius:8,backgroundColor:'#2E7D32',alignItems:'center',marginTop:16},botaoTexto:{color:'#fff',fontWeight:'bold'},desabilitado:{opacity:0.5},cancelar:{padding:14,alignItems:'center'},aviso:{color:'#B71C1C',marginBottom:10}});

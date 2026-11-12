import { useEffect, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAvisos } from '../contexts/AvisosContext';
import { buscarPontoPorId, cadastrarPonto, editarPonto } from '../services/pontosService';
import type { PontoRequest } from '../types/Ponto';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroPonto'>;
const vazio: PontoRequest = { nome: '', endereco: '', bairro: '', horario: '', tipo: 'coleta' };
const campos = [
  ['nome', 'Nome'], ['endereco', 'Endereço'], ['bairro', 'Bairro'], ['horario', 'Horário'],
] as const;
export function TelaCadastroPonto({ route, navigation }: Props) {
  const id = route.params?.pontoId;
  const { avisar } = useAvisos();
  const [dados, setDados] = useState<PontoRequest>(vazio);
  const [carregando, setCarregando] = useState(!!id);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const trava = useRef(false);
  useEffect(() => {
    let ativo = true;
    setErro(''); setCarregando(!!id); setDados(vazio);
    if (id) {
      buscarPontoPorId(id).then(p => {
        if (ativo) setDados({ nome: p.nome, endereco: p.endereco, bairro: p.bairro, horario: p.horario, tipo: p.tipo });
      }).catch((e: unknown) => {
        if (ativo) setErro(e instanceof Error ? e.message : 'Não foi possível carregar o ponto.');
      }).finally(() => { if (ativo) setCarregando(false); });
    }
    return () => { ativo = false; };
  }, [id, tentativa]);
  async function salvar() {
    if (trava.current || carregando || erro) return;
    trava.current = true;
    setSalvando(true);
    try {
      const payload = { ...dados, nome: dados.nome.trim(), endereco: dados.endereco.trim(), bairro: dados.bairro.trim(), horario: dados.horario.trim() };
      if (!payload.nome || !payload.endereco || !payload.bairro || !payload.horario) {
        await avisar('Campos obrigatórios', 'Preencha nome, endereço, bairro e horário.');
        return;
      }
      if (id) await editarPonto(id, payload);
      else await cadastrarPonto(payload);
      await avisar('Sucesso', `Ponto “${payload.nome}” ${id ? 'atualizado' : 'cadastrado'} com sucesso.`);
      navigation.goBack();
    } catch (e: unknown) {
      await avisar('Não foi possível salvar', e instanceof Error ? e.message : 'Tente novamente.');
    } finally { trava.current = false; setSalvando(false); }
  }
  return <SafeAreaView style={styles.area} edges={['bottom', 'left', 'right']}>
    <KeyboardAvoidingView style={styles.area} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.corpo} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>{id ? 'Editar ponto' : 'Cadastrar ponto'}</Text>
        {carregando ? <ActivityIndicator accessibilityLabel="Carregando ponto" /> : erro ? <View>
          <Text style={styles.erro}>{erro}</Text>
          <TouchableOpacity accessibilityRole="button" style={styles.botao} onPress={() => setTentativa(n => n + 1)}>
            <Text style={styles.botaoTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View> : <>
          {campos.map(([campo, titulo]) => <View key={campo}>
            <Text style={styles.rotulo}>{titulo}</Text>
            <TextInput accessibilityLabel={titulo} placeholder={campo === 'horario' ? 'Seg a Sex, 8h às 17h' : titulo}
              style={styles.input} maxLength={255} editable={!salvando} value={dados[campo]}
              onChangeText={valor => setDados(atuais => ({ ...atuais, [campo]: valor }))} />
          </View>)}
          <Text style={styles.rotulo}>Tipo</Text>
          <View style={styles.tipos}>
            {(['coleta', 'distribuição'] as const).map(tipo => <TouchableOpacity key={tipo}
              accessibilityRole="radio" accessibilityState={{ checked: dados.tipo === tipo, disabled: salvando }}
              disabled={salvando} style={[styles.opcao, dados.tipo === tipo && styles.selecionado]}
              onPress={() => setDados(atuais => ({ ...atuais, tipo }))}>
              <Text>{dados.tipo === tipo ? '● ' : '○ '}{tipo === 'coleta' ? 'Coleta' : 'Distribuição'}</Text>
            </TouchableOpacity>)}
          </View>
          <TouchableOpacity accessibilityRole="button" disabled={salvando} style={[styles.botao, salvando && styles.desabilitado]}
            onPress={() => { void salvar(); }}>
            <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : id ? 'Salvar alterações' : 'Cadastrar'}</Text>
          </TouchableOpacity>
        </>}
        <TouchableOpacity accessibilityRole="button" disabled={salvando} style={styles.cancelar} onPress={() => navigation.goBack()}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: '#fff' }, corpo: { padding: 20, paddingBottom: 40 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 20 },
  rotulo: { fontWeight: 'bold', color: '#1B3A5C', marginBottom: 6 },
  input: { minHeight: 44, padding: 12, borderWidth: 1, borderColor: '#aaa', borderRadius: 8, marginBottom: 16 },
  tipos: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  opcao: { minHeight: 44, padding: 12, borderWidth: 1, borderColor: '#aaa', borderRadius: 8 },
  selecionado: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' },
  botao: { minHeight: 44, backgroundColor: '#2E7D32', padding: 14, borderRadius: 8, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold' }, cancelar: { minHeight: 44, padding: 14, alignItems: 'center', marginTop: 12 },
  erro: { color: '#B71C1C', marginBottom: 16 }, desabilitado: { opacity: 0.5 },
});

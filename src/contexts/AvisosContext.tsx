import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Alert, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Avisos = {
  avisar: (titulo: string, mensagem: string) => Promise<void>;
  confirmar: (titulo: string, mensagem: string) => Promise<boolean>;
};
type Dialogo = { titulo: string; mensagem: string; confirmacao: boolean; resolver: (valor: boolean) => void };
const Context = createContext<Avisos | null>(null);

export function AvisosProvider({ children }: { children: ReactNode }) {
  const [fila, setFila] = useState<Dialogo[]>([]);
  const abrir = useCallback((titulo: string, mensagem: string, confirmacao: boolean): Promise<boolean> => {
    return new Promise(resolve => {
      if (Platform.OS === 'web') {
        setFila(atuais => [...atuais, { titulo, mensagem, confirmacao, resolver: resolve }]);
        return;
      }
      Alert.alert(titulo, mensagem, confirmacao ? [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Excluir', style: 'destructive', onPress: () => resolve(true) },
      ] : [{ text: 'OK', onPress: () => resolve(true) }], {
        cancelable: true, onDismiss: () => resolve(!confirmacao),
      });
    });
  }, []);
  const valor = useMemo<Avisos>(() => ({
    avisar: async (titulo, mensagem) => { await abrir(titulo, mensagem, false); },
    confirmar: (titulo, mensagem) => abrir(titulo, mensagem, true),
  }), [abrir]);
  const atual = fila[0];
  function fechar(confirmado: boolean) {
    if (!atual) return;
    setFila(anteriores => anteriores.slice(1));
    atual.resolver(confirmado);
  }
  return <Context.Provider value={valor}>
    {children}
    {Platform.OS === 'web' && atual ? <Modal visible transparent animationType="none"
      onRequestClose={() => fechar(!atual.confirmacao)}>
      <View style={styles.fundo}>
        <View style={styles.caixa} accessibilityViewIsModal>
          <Text accessibilityRole="header" style={styles.titulo}>{atual.titulo}</Text>
          <Text style={styles.mensagem}>{atual.mensagem}</Text>
          <View style={styles.acoes}>
            {atual.confirmacao ? <TouchableOpacity accessibilityRole="button"
              style={styles.cancelar} onPress={() => fechar(false)}>
              <Text>Cancelar</Text>
            </TouchableOpacity> : null}
            <TouchableOpacity accessibilityRole="button" style={[styles.botao, atual.confirmacao && styles.excluir]}
              onPress={() => fechar(true)}>
              <Text style={styles.botaoTexto}>{atual.confirmacao ? 'Excluir' : 'OK'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal> : null}
  </Context.Provider>;
}
export function useAvisos(): Avisos {
  const avisos = useContext(Context);
  if (!avisos) throw new Error('useAvisos deve ser usado dentro de AvisosProvider');
  return avisos;
}
const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  caixa: { width: '100%', maxWidth: 440, padding: 24, backgroundColor: '#fff', borderRadius: 12 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#1B3A5C', marginBottom: 12 },
  mensagem: { fontSize: 16, color: '#333', marginBottom: 24 },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelar: { minHeight: 44, padding: 12, borderWidth: 1, borderColor: '#aaa', borderRadius: 8, justifyContent: 'center' },
  botao: { minHeight: 44, padding: 12, backgroundColor: '#2E7D32', borderRadius: 8, justifyContent: 'center' },
  excluir: { backgroundColor: '#C62828' },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
});

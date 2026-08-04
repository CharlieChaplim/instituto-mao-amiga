import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Loja Compre Bem</Text>
      <Text style={styles.texto}>Hello World!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  texto: {
    marginTop: 8,
    fontSize: 20,
  },
});
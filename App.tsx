import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AvisosProvider } from './src/contexts/AvisosContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AvisosProvider>
        <AppNavigator />
      </AvisosProvider>
    </SafeAreaProvider>
  );
}

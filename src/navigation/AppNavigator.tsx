import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TelaCadastroDoacao } from '../screens/TelaCadastroDoacao';
import { TelaDetalhePonto } from '../screens/TelaDetalhePonto';
import { TelaListaPontos } from '../screens/TelaListaPontos';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen
          name="Lista"
          component={TelaListaPontos}
          options={{ title: 'Instituto Mão Amiga' }}
        />
        <Stack.Screen
          name="Detalhe"
          component={TelaDetalhePonto}
          options={{ title: 'Detalhe do ponto' }}
        />
        <Stack.Screen
          name="Cadastro"
          component={TelaCadastroDoacao}
          options={{ title: 'Cadastro de doação' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

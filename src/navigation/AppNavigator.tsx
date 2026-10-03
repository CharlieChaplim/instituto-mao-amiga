import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TelaCadastroDoacao } from '../screens/TelaCadastroDoacao';
import { TelaDetalheDoacao } from '../screens/TelaDetalheDoacao';
import { TelaDetalhePonto } from '../screens/TelaDetalhePonto';
import { TelaHistoricoDoacoes } from '../screens/TelaHistoricoDoacoes';
import { TelaListaPontos } from '../screens/TelaListaPontos';

import { RootStackParamList } from '../types/navigation';

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen
          name="Lista"
          component={TelaListaPontos}
          options={{
            title: 'Instituto Mão Amiga',
          }}
        />

        <Stack.Screen
          name="Detalhe"
          component={TelaDetalhePonto}
          options={{
            title: 'Detalhe do ponto',
          }}
        />

        <Stack.Screen
          name="Cadastro"
          component={TelaCadastroDoacao}
          options={({ route }) => ({
            title: route.params?.doacao
              ? 'Editar doação'
              : 'Cadastro de doação',
          })}
        />

        <Stack.Screen
          name="Historico"
          component={TelaHistoricoDoacoes}
          options={{
            title: 'Minhas doações',
          }}
        />

        <Stack.Screen
          name="DetalheDoacao"
          component={TelaDetalheDoacao}
          options={{
            title: 'Detalhe da doação',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import { criarFavoritos } from '../state/favoritos';

// Uma única instância sincroniza a lista e Meus pontos. Só UUIDs são persistidos.
export const favoritos = criarFavoritos(AsyncStorage);

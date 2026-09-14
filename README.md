# Instituto Mão Amiga

Projeto individual em React Native com Expo.

## Aula 14 — Responsividade

A versão desta pasta inclui os ajustes da Issue #06:

- projeto atualizado para Expo SDK 57;
- a tela principal usa `FlatList` e o botão **Criar doação** fica no cabeçalho da lista, portanto sai da tela naturalmente ao rolar;
- a tela de detalhe usa `ScrollView` para não cortar conteúdo em telas menores;
- a tela de cadastro usa `SafeAreaView`, `KeyboardAvoidingView` e `ScrollView`;
- campos e botões têm `minHeight: 44`;
- larguras dos campos e botões são relativas (`width: '100%'`).

## Como rodar

Requer Node.js 22.

```bash
npm install
npx expo-doctor@latest
npx expo start
```

Abra no Expo Go e teste em pelo menos dois tamanhos de tela antes de fechar a Issue #06.

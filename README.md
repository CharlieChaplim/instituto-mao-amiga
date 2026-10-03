# Instituto Mão Amiga

Aplicativo individual em React Native com Expo para consulta de pontos de coleta e gerenciamento de doações.

## Funcionalidades

- consulta de pontos de coleta e distribuição;
- cadastro de doações;
- histórico local usando AsyncStorage;
- detalhe, edição e exclusão de doações;
- filtro por tipo de item;
- resumo com totais agrupados por tipo.

## Estrutura principal

```text
src/
├── components/   Componentes reutilizáveis
├── data/         Dados locais dos pontos
├── navigation/   Navegação do aplicativo
├── screens/      Telas
├── storage/      Persistência das doações
└── types/        Tipos TypeScript
```

## Executar

```bash
npm install
npm start
```

## Verificações

```bash
npm run typecheck
npm run doctor
```

O arquivo de entrada usado pelo projeto é `index.js`, conforme definido em `package.json`.

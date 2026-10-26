# Instituto Mão Amiga

Aplicativo individual Expo + React Native + TypeScript com API própria de pontos de coleta e distribuição em Spring Boot.

## Funcionalidades

- lista paginada e detalhe de pontos obtidos da API;
- erro amigável quando a API não responde e estado 404 no detalhe;
- cadastro de doações com validação e seleção de pontos da API;
- histórico persistente de doações salvas no aparelho, com edição, exclusão, filtro e totais por tipo.

## Estrutura

- `api/`: API Spring Boot, JPA e H2;
- `src/types/`: tipos TypeScript de pontos, doações e rotas;
- `src/services/api.ts`: único acesso ao `fetch`, incluindo a URL da API;
- `src/services/pontosService.ts`: listagem paginada e consulta de ponto;
- `src/services/doacoesStorage.ts`: persistência local de doações;
- `src/screens/`: interface do usuário;
- `src/navigation/`: rotas tipadas.

## Executar

Java 21 + Maven, Node.js/npm e ambiente Expo instalados.

1. Em um terminal: `cd api && mvn spring-boot:run`.
2. Ajuste `API_URL` em `src/services/api.ts` para apontar à máquina que roda a API. Android Emulator: `http://10.0.2.2:8080`; web/iOS simulator: `http://localhost:8080`; celular físico: `http://IP_DO_COMPUTADOR:8080` na mesma rede Wi-Fi.
3. Na raiz: `npm ci && npm start`.

## Verificações

- `npx tsc --noEmit`
- `cd api && mvn test`
- `curl "http://localhost:8080/pontos?page=0&size=3&sort=nome,asc"`
- `curl -i http://localhost:8080/pontos/999999` (404)

Os 8 registros iniciais são dados **demonstrativos** com locais de referência em Goiânia. Não indicam que há postos reais de doação nestes lugares. A API é apenas de consulta; as doações permanecem no aparelho na chave antiga do AsyncStorage.

Mais detalhes: `README-SPRINT3.md`. Branch de entrega: `feat/sprint3-issue16-api-pontos`. A atividade usa o nome Issue #16, mas a issue real aberta foi a [#14](https://github.com/CharlieChaplim/instituto-mao-amiga/issues/14).

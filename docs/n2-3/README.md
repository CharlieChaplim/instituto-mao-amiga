# N2-3 — App listando os pontos da API (#18)

Depende da N2-2 (#17). A lista e o detalhe agora usam o contrato `/api/v1`,
UUID em string e campos `nome`, `endereco`, `bairro`, `horario` e `tipo`.

## Implementação

- `src/services/api.ts`: único `fetch`, URL central, `get`, `post`, `put`, `del`,
  `ApiError.status`, suporte a DELETE 204 e limite de espera de 15 segundos.
- `pontosService.ts`: lista completa, página com filtro, consulta por ID e
  operações de cadastro, edição e exclusão. As telas não constroem URLs.
- `state/paginacaoPontos.ts`: trava síncrona de requisições, próxima página,
  descarte de respostas antigas e retry explícito preservando páginas carregadas.
- `TelaListaPontos`: busca por nome/bairro no servidor, reinício na página zero,
  `FlatList.onEndReached`, fim de paginação, carregamento, erro e resultado vazio.
- O detalhe recebe somente `pontoId`, consulta a API e trata 404 com
  “Ponto não encontrado”. Exibe bairro e tipo em vez dos campos antigos.
- Corrigida a capitalização dos imports de `Ponto.ts` para Linux.
- O cadastro de doação usa a lista completa de destinos do novo endpoint.
  As doações continuam salvas no AsyncStorage até a N2-6 (#21).
- Formulários CRUD de pontos no app ficam para a N2-4 (#19).

## Executar no navegador

Na pasta `api/`, com JDK 21, execute `mvnw.cmd spring-boot:run`.
Em outro terminal, na raiz, execute:

```bat
npm ci
npm run typecheck
npm run web
```

O app deve abrir no endereço informado pelo Expo, normalmente
`http://localhost:8081`. A API fica em `http://localhost:8080`.

## Testar no celular físico

Em `src/services/api.ts`, troque **somente** a constante `API_URL`:

```ts
const API_URL = 'http://192.168.1.6:8080/api/v1';
```

O IP acima é apenas exemplo. Use o IPv4 atual do computador, obtido com
`ipconfig`, e deixe celular e computador na mesma rede. Preserve `/api/v1`.
Abra a porta 8080 na rede privada se o firewall impedir a conexão.
Para Android Emulator, use `http://10.0.2.2:8080/api/v1`.

## Verificações reproduzíveis

```bat
npm run typecheck
node --test tests/n2-3.test.cjs
npx expo export --platform web
```

Os sete testes automatizados cobrem métodos HTTP, JSON e DELETE 204, status de
falha, codificação de filtros/IDs, solicitações simultâneas, fim da paginação,
respostas fora de ordem, retry e cancelamento. Não alteram o banco da API.

Roteiro manual:

1. Abra o app com a API ligada: confira os primeiros pontos.
2. Role até o final: as páginas seguintes carregam automaticamente. No painel
   Network, cada página deve ser pedida uma vez por busca, salvo retry explícito.
3. Busque `Central`, depois `MERCADO`, e apague a busca: volta à primeira página.
4. Busque algo inexistente: mensagem de nenhum resultado, campo de busca visível.
5. Abra um ponto: confira nome, endereço, bairro, horário e tipo.
6. Para verificar 404, carregue a lista e exclua um ponto pelo Swagger antes de
   tocá-lo: o detalhe deve mostrar “Ponto não encontrado”.
7. Desligue a API e atualize a busca: mensagem de erro e botão Tentar novamente.
   Religue a API e tente novamente: a listagem se recupera.
8. Abra Criar doação: destinos vindos da API. Cadastre uma doação e confira o
   histórico local. Essa etapa ainda não migra doações para o servidor.

O teste no celular físico deve ser feito no seu ambiente. Não foi declarado
como concluído nesta entrega. Resultados executados: [VALIDACAO.md](VALIDACAO.md).

# N2-5 — CRUD de doações na API (#20)

Base: main em `75acd89`, com a N2-4 integrada. Esta entrega implementa somente
backend e testes. Cadastro/histórico de doações no app continuam no AsyncStorage
até a N2-6; os dados locais não são enviados automaticamente ao servidor.

## Executar

Na pasta `api/`, usando JDK 21:

```bat
mvnw.cmd clean test
mvnw.cmd spring-boot:run
```

Use apenas uma instância. Se você iniciou anteriormente com `spring-boot:start`,
encerre-a com `mvnw.cmd spring-boot:stop` antes de usar `spring-boot:run`.
Não apague `data/maoamiga.mv.db`: ele contém seus dados. Esta issue acrescenta a
tabela `doacoes` no mesmo H2 em arquivo, com `ddl-auto=update`.

Swagger: http://localhost:8080/swagger-ui/index.html

## Endpoints

| Método | URL | Sucesso |
|---|---|---|
| GET | `/api/v1/doacoes/filtro?filtro=roupa&page=0&size=10` | 200, `content` + `page` |
| GET | `/api/v1/doacoes/{id}` | 200, DTO da doação |
| POST | `/api/v1/doacoes` | 201, DTO e cabeçalho Location |
| PUT | `/api/v1/doacoes/{id}` | 200, DTO atualizado |
| DELETE | `/api/v1/doacoes/{id}` | 204, sem corpo |

Corpo para POST e PUT:

```json
{
  "tipoItem": "Alimentos",
  "quantidade": 3,
  "pontoDestino": "Mercado Central"
}
```

O servidor gera `id` UUID e `criadoEm` LocalDateTime no cadastro. O DTO de entrada
não contém esses campos; se enviados como propriedades extras, não são usados.
A edição mantém ID e data original. A data é gerada com `LocalDateTime.now()` e
normalizada para microssegundos, precisão do TIMESTAMP padrão do H2, para evitar
diferenças de arredondamento entre a resposta do cadastro e leituras posteriores.

`tipoItem` e `pontoDestino` são obrigatórios, não vazios e limitados a 255
caracteres. `quantidade` é Integer obrigatório, positivo. Números decimais são
recusados com 400, em vez de truncados para inteiro pelo Jackson.
O destino é o **nome** do ponto, sem relacionamento JPA, conforme o enunciado.

Filtro ausente, vazio ou em branco lista todas as doações paginadas. A busca usa
`@Query` e ignora maiúsculas no tipo do item. `@PageableDefault` define 10 itens
por página, ordenados por `criadoEm` decrescente. Não há carga inicial de doações.

GET, PUT e DELETE com UUID inexistente respondem 404. UUID malformado e dados
inválidos respondem 400. Requisições inválidas não criam nem alteram registros.
CORS está liberado como nos endpoints de pontos.

## Prints do Swagger — captura local pendente

As imagens abaixo devem ser capturadas de uma execução real, incluindo URL,
código HTTP e corpo da resposta (quando existir). Não há prints simulados.

1. POST válido: capture 201 e copie o UUID retornado.
2. GET `/filtro`: capture 200, `content` e `page`.
3. GET por UUID: capture 200 com `id` e `criadoEm`.
4. PUT no mesmo UUID, quantidade 5: capture 200 e confira ID/data preservados.
5. POST com quantidade 0: capture 400; confira que a lista não aumentou.
6. PUT com tipo vazio: confira 400 e que o registro válido permaneceu inalterado.
7. DELETE do UUID criado: capture 204.
8. GET e PUT desse UUID excluído: capture 404 (PUT deve usar corpo válido).

Depois de salvar as imagens em `docs/n2-5/`, insira os links Markdown no README.
A integração do commit à main fechará a issue por `Closes #20`; faça isso apenas
após completar os critérios, inclusive esses prints e a conferência local.

## Testes

`DoacaoControllerTest` usa MockMvc com JPA e H2 em memória isolado do seu banco.
Cobre CRUD completo, UUID, data gerada no servidor e preservada ao editar,
validação no POST/PUT sem escrita inválida, 404, filtro sem distinção de caixa,
paginação, ordenação cronológica, OpenAPI e CORS.

A suíte existente de pontos também deve continuar passando.

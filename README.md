# N2-1 — CRUD de pontos na API (issue #16)

Esta branch implementa apenas a primeira etapa da N2. A API fica em `api/`.
O app ainda usa o contrato anterior (`/pontos`, ID numérico e campos antigos).
Sua integração com `/api/v1/pontos` será feita na N2-3 (#18); nesta etapa,
valide a API pelo Swagger. Doações e favoritos não foram alterados.

## Executar a API

Requisitos: Java 21 e acesso à internet no primeiro uso do Maven Wrapper.
Abra um terminal na pasta `api/` e execute:

```powershell
# Windows PowerShell
.\mvnw.cmd spring-boot:run
```

```bash
# Linux/macOS (dispensa permissão de execução do script)
bash mvnw spring-boot:run
```

Swagger: http://localhost:8080/swagger-ui/index.html
OpenAPI: http://localhost:8080/v3/api-docs

O H2 grava em `api/data/maoamiga.mv.db` quando o comando é executado em `api/`.
Sempre inicie nessa pasta. `ddl-auto=update` preserva os dados; não apague o
arquivo do banco para reiniciar a aplicação. Os arquivos do H2 são ignorados pelo Git.
A carga inicial insere oito pontos demonstrativos em Goiânia somente se a tabela
estiver vazia. Os locais não representam postos reais de doação confirmados.

## Endpoints N2-1

Base: `http://localhost:8080`.

| Método | URL | Sucesso |
|---|---|---|
| GET | `/api/v1/pontos` | 200, lista de pontos |
| GET | `/api/v1/pontos/{id}` | 200, ponto |
| POST | `/api/v1/pontos` | 201, ponto criado e cabeçalho Location |
| PUT | `/api/v1/pontos/{id}` | 200, ponto atualizado com mesmo ID |
| DELETE | `/api/v1/pontos/{id}` | 204, sem corpo |

GET, PUT e DELETE com UUID inexistente respondem 404. UUID malformado responde
400. Campos obrigatórios ausentes, vazios ou em branco respondem 400. O tipo
aceita somente `coleta` ou `distribuição`; campos de texto têm limite de 255
caracteres. O controller recebe DTO validado com `@Valid` e devolve DTO, nunca a
entidade. A listagem desta etapa não é paginada.

Corpo para POST e PUT:

```json
{
  "nome": "Ponto de teste N2",
  "endereco": "Rua 3, Goiânia - GO",
  "bairro": "Setor Central",
  "horario": "Seg a Sex, 8h às 17h",
  "tipo": "coleta"
}
```

A resposta contém esses cinco campos e `id` (UUID gerado pelo servidor).

## Testes e evidências de aceite

Na pasta `api/`, execute `./mvnw.cmd test` no PowerShell ou `bash mvnw test` no
Linux/macOS. Os testes usam H2 isolado em memória, sem alterar o banco local.
Cobrem CRUD, UUID, campos vazios/ausentes, tipo inválido, ausência de gravação
inválida, 404, CORS, OpenAPI e seed sem duplicação.

**Situação desta entrega:** testes escritos, mas não executados neste ambiente,
pois a resolução de `repo.maven.apache.org` falhou ao baixar dependências.
Os prints do Swagger ainda precisam ser capturados em uma execução local real.
Não fechar a issue antes de completar essas verificações.

No Swagger, use “Try it out” e “Execute”:

1. GET da lista: conferir pelo menos oito pontos e capturar a resposta 200.
2. POST válido com o corpo acima: capturar 201 e copiar o UUID retornado.
3. GET desse UUID: capturar 200.
4. PUT desse UUID, alterando o nome: capturar 200 e conferir que o ID foi mantido.
5. POST com `nome` vazio: capturar 400 e conferir que nenhum registro foi criado.
6. PUT do UUID válido com `bairro` vazio: conferir 400 e que o registro não mudou.
7. Reiniciar a API e consultar o ponto: conferir persistência e quantidade inalterada.
8. DELETE do UUID criado: capturar 204.
9. GET e PUT desse UUID excluído (PUT com corpo válido): capturar os 404.

Salve os prints em `docs/n2-1/` e insira-os abaixo antes de concluir a issue.
Cada print deve mostrar endpoint, código HTTP e corpo quando houver. Para 204,
a ausência de corpo é esperada. Não há imagens simuladas nesta entrega.

## Evidências do Swagger (pendentes de captura local)

- GET lista — 200.
- GET por ID — 200.
- POST — 201.
- PUT — 200.
- DELETE — 204.
- POST/PUT inválidos — 400.
- GET/PUT inexistentes — 404.

---

## Referência histórica do app (antes da integração N2-3)

Os endpoints e o modelo descritos abaixo pertencem à versão anterior e não são
compatíveis com esta API N2-1. Permanecem como referência para a próxima etapa.

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

A integração anterior foi entregue na issue #14. A N2-1 corresponde à issue #16.


# N2-2 — Busca de pontos com paginação (issue #17)

Esta seção atualiza a referência N2-1 acima. `GET /api/v1/pontos` continua
retornando a lista completa; o endpoint novo de busca é
`GET /api/v1/pontos/filtro?filtro=...&page=0&size=10`.

- Busca com `@Query` pelo nome **ou** bairro, sem diferenciar maiúsculas.
- Filtro ausente, vazio ou só com espaços retorna todos os pontos paginados.
- `@PageableDefault`: 10 itens, primeira página `0`, ordem por nome crescente.
- `sort=bairro,asc` troca a ordenação; `page=1` pede a segunda página.
- Retorno `Page<PontoResponseDTO>` serializado como `content` + `page`.
- A propriedade `spring.data.web.pageable.serialization-mode=via_dto` é mantida;
  `PaginacaoConfig` também habilita explicitamente `VIA_DTO`.
- 25 pontos de demonstração: oito anteriores e 17 novos, com bairros de Goiânia.
  Endereços dos pontos adicionais são fictícios, identificados como demonstrativos.
- Carga versionada em `cargas_iniciais`: atualiza o banco da N2-1 sem apagar os
  registros existentes. Nomes originais já presentes são preservados com seus IDs.
  A carga roda uma vez; reiniciar não duplica nem recria pontos apagados depois dela.
  Se um ponto original foi renomeado antes da atualização, o ponto demonstrativo
  com o nome original poderá ser inserido, preservando o registro renomeado.
- O app ainda será integrado na N2-3 (#18). Esta etapa altera apenas a API.

## Três chamadas e respostas verificadas

Respostas reais capturadas por MockMvc nos testes de integração com H2 isolado
em memória e a carga inicial de 25 pontos. Usamos `size=1` para mostrar cada
corpo completo; os UUIDs serão diferentes no banco local. Sem `size`, o padrão
continua sendo **10**. Esses registros não são prints do Swagger.

### Sem filtro

GET `http://localhost:8080/api/v1/pontos/filtro?size=1`

Resposta verificada: HTTP 200.

```json
{
  "content": [
    {
      "id": "9501a4f5-4a89-4227-9843-fda6549d5255",
      "nome": "Campinas (demonstração)",
      "endereco": "Av. 24 de Outubro, Goiânia - GO",
      "bairro": "Campinas",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "distribuição"
    }
  ],
  "page": {
    "size": 1,
    "number": 0,
    "totalElements": 25,
    "totalPages": 25
  }
}
```

### Filtrando por bairro

GET `http://localhost:8080/api/v1/pontos/filtro?filtro=Setor%20Central&size=1`

Resposta verificada: HTTP 200.

```json
{
  "content": [
    {
      "id": "162d623a-e04f-4b13-850e-30b95022a026",
      "nome": "Mercado Central (demonstração)",
      "endereco": "Rua 3, Goiânia - GO",
      "bairro": "Setor Central",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "coleta"
    }
  ],
  "page": {
    "size": 1,
    "number": 0,
    "totalElements": 2,
    "totalPages": 2
  }
}
```

### Segunda página

GET `http://localhost:8080/api/v1/pontos/filtro?page=1&size=1`

Resposta verificada: HTTP 200.

```json
{
  "content": [
    {
      "id": "162d623a-e04f-4b13-850e-30b95022a026",
      "nome": "Mercado Central (demonstração)",
      "endereco": "Rua 3, Goiânia - GO",
      "bairro": "Setor Central",
      "horario": "Seg a Sex, 8h às 17h",
      "tipo": "coleta"
    }
  ],
  "page": {
    "size": 1,
    "number": 1,
    "totalElements": 25,
    "totalPages": 25
  }
}
```

## Validação da N2-2

Na pasta `api/`, com Java 21:

```powershell
.\mvnw.cmd clean test
.\mvnw.cmd spring-boot:run
```

No Linux/macOS: `bash mvnw clean test` e `bash mvnw spring-boot:run`.

1. Abra `http://localhost:8080/api/v1/pontos/filtro`: confira `page.size=10` e,
   com a carga original, `totalElements=25`, `totalPages=3` e `number=0`.
2. Compare `?filtro=mercado` com `?filtro=MERCADO`: mesmos resultados.
3. Execute as três chamadas documentadas acima e registre as respostas reais.
4. Confira `?sort=bairro,asc`, `?page=1` e `?page=2` (última página com cinco itens
   se o banco contiver somente os 25 pontos iniciais).
5. Reinicie a API: a quantidade não deve crescer. Não apague `api/data/`.
6. Teste novamente o CRUD da N2-1.

`PontoFiltroTest` cobre paginação, ordenação, filtros, resposta vazia, atualização
da carga de oito para 25 registros, preservação de IDs e reinício sem recriação
após exclusão. `PontoControllerTest` continua cobrindo o CRUD da N2-1.

Para gravar as três respostas reais em `docs/n2-2/`, execute **na raiz**:

```powershell
New-Item -ItemType Directory -Force docs/n2-2 | Out-Null
curl.exe --fail "http://localhost:8080/api/v1/pontos/filtro?size=1" -o docs/n2-2/sem-filtro.json
curl.exe --fail "http://localhost:8080/api/v1/pontos/filtro?filtro=Setor%20Central&size=1" -o docs/n2-2/por-bairro.json
curl.exe --fail "http://localhost:8080/api/v1/pontos/filtro?page=1&size=1" -o docs/n2-2/segunda-pagina.json
```

Depois da captura: [sem filtro](docs/n2-2/sem-filtro.json),
[por bairro](docs/n2-2/por-bairro.json) e [segunda página](docs/n2-2/segunda-pagina.json).
Os arquivos incluídos foram gerados pelos testes de integração; os comandos acima
permitem substituí-los pelas respostas da sua execução local.

## Resultado da validação desta entrega

10 testes passaram (5 de CRUD e 5 da N2-2), sem falhas, erros ou testes ignorados,
com JDK 21.0.13. Relatório: [VALIDACAO.md](docs/n2-2/VALIDACAO.md).
A nota anterior sobre testes não executados descreve a entrega original da N2-1;
a suíte de CRUD foi executada com sucesso nesta entrega.


# N2-3 — App integrado à API (#18)

A lista e o detalhe do app já usam `/api/v1/pontos`, UUID e o novo modelo.
Esta seção substitui os avisos anteriores de incompatibilidade do app.
Busca por nome/bairro e rolagem infinita usam `/api/v1/pontos/filtro`.
A URL é configurada apenas em `src/services/api.ts`, incluindo `/api/v1`.
As doações continuam locais nesta etapa.

Veja [execução, configuração de IP e testes da N2-3](docs/n2-3/README.md) e
[resultado da validação](docs/n2-3/VALIDACAO.md).


# N2-4 — CRUD de pontos e avisos corrigidos (#19)

O app permite cadastrar, editar e excluir pontos pela API. Cadastro e edição
reutilizam o mesmo formulário, e exclusões pedem confirmação.
Os avisos de sucesso, validação e exclusão de doações agora funcionam na web por
meio de diálogos da aplicação; Android/iOS continuam usando Alert.alert.
Doações permanecem no AsyncStorage nesta etapa.

Execute `npm ci`, `npm run typecheck` e `npm test`. Com a API ligada,
execute `npx expo start --web --clear` na raiz.

Veja [funcionalidades e roteiro de aceite](docs/n2-4/README.md) e
[validação: 17 testes passaram](docs/n2-4/VALIDACAO.md).

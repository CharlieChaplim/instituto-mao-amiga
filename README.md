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

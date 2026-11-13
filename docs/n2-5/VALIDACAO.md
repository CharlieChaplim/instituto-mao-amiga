# Validação N2-5 — 13/11/2026

Base clonada do GitHub: `75acd89` (main, N2-4 integrada).

| Suíte | Testes | Falhas | Erros | Ignorados |
|---|---:|---:|---:|---:|
| PontoControllerTest | 5 | 0 | 0 | 0 |
| PontoFiltroTest | 5 | 0 | 0 | 0 |
| DoacaoControllerTest | 5 | 0 | 0 | 0 |

Compilação e 15 testes passaram com JDK 21.0.13. O Maven precisou de proxy do
ambiente para baixar dependências e do agente Mockito explicitamente carregado
para executar testes sem anexação dinâmica. No computador local use
`mvnw.cmd clean test`, como nas etapas anteriores.

Também foi iniciada a API real com H2 em arquivo temporário isolado. Foram
verificados por HTTP: POST 201, filtro 200, PUT 200, quantidade inválida 400,
DELETE 204, GET/PUT inexistentes 404. A API foi encerrada e reiniciada entre PUT
e GET: quantidade, UUID e criadoEm permaneceram iguais. Campos de data enviados
pelo cliente não determinaram a data gerada no servidor.

Respostas reais: [http-verificado.json](http-verificado.json). Os IDs desse
arquivo pertencem ao banco temporário de teste e não ao banco do usuário.

O patch foi aplicado numa árvore de trabalho limpa da mesma base e seu conteúdo
comparado com a implementação antes do commit. `git diff --check` passou.

**Pendência de aceite:** prints do Swagger de cada endpoint, 400 e 404. As
respostas JSON não substituem os prints solicitados pelo professor. O roteiro
está no README. Não foi feita integração do app nem teste em celular nesta issue.

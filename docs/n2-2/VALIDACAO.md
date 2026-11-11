# Validação N2-2

Executado em 11/11/2026 com JDK Eclipse Temurin 21.0.13 e Spring Boot 3.5.7.

| Classe | Testes | Falhas | Erros | Ignorados |
|---|---:|---:|---:|---:|
| PontoControllerTest | 5 | 0 | 0 | 0 |
| PontoFiltroTest | 5 | 0 | 0 | 0 |

Os testes exercitam os controllers via MockMvc e repositories reais com H2
isolado em memória. Verificam CRUD, validação, 404, CORS, OpenAPI, DTOs paginados,
busca por nome/bairro, maiúsculas, ordenação, página vazia e migração de oito
para 25 pontos preservando os IDs. A migração também é chamada novamente após
uma exclusão para conferir que o ponto não é recriado.

As respostas JSON incluídas são capturas reais dessa suíte; seus UUIDs pertencem
ao banco de testes e não devem ser usados como IDs no banco local. Não foi
executado o app, que será adaptado na N2-3. A persistência física entre processos
continua sendo uma checagem manual do roteiro.

Neste ambiente, o Maven precisou de proxy e JDK completo para baixar dependências.
A execução final usou cache offline e o agente Mockito carregado explicitamente
porque a anexação dinâmica de agentes é indisponível no ambiente:

```bash
bash mvnw -o '-DargLine=-javaagent:/home/agent/.m2/repository/org/mockito/mockito-core/5.17.0/mockito-core-5.17.0.jar' test -q
```

Esse caminho pertence ao ambiente de validação. No seu computador, use
`.\mvnw.cmd clean test` com JDK 21; não copie o caminho Linux do agente.

A configuração do Lombok corrigida na N2-1 está preservada no projeto completo.
`git diff --check` também passou.

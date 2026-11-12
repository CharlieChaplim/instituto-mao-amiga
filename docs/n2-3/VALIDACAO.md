# Validação N2-3 — 12/11/2026

- `npm run typecheck`: passou, sem erros TypeScript.
- `node --test tests/n2-3.test.cjs`: 7 testes passaram, zero falhas.
- `npx expo export --platform web`: bundle web gerado com sucesso.
- Serviços TypeScript reais executados via Node contra Spring Boot em HTTP e
  banco H2 temporário: lista de 25 pontos, páginas acumuladas de 10/20/25,
  fim da paginação, busca MERCADO, detalhe com UUID, resultado vazio, status 404,
  POST, PUT e DELETE 204 passaram. Os pontos criados no teste foram removidos.
- `git diff --check`: passou.
- Inspeção: `fetch` somente em `src/services/api.ts`; nenhuma URL nas telas;
  imports de Ponto com capitalização correta; doações continuam no armazenamento local.

## Limitações

A validação visual no navegador e o teste em celular físico estão pendentes.
O Chromium local não iniciou por restrição de sockets do ambiente, e o navegador
remoto não alcançou o servidor de desenvolvimento local. O build web e o teste
HTTP acima não substituem a conferência visual de navegação, teclado e rolagem.
Execute o roteiro do README no seu navegador antes de fechar a issue #18.

A API não foi alterada nesta entrega; o teste HTTP usou a implementação da N2-2.
O pacote completo preserva a correção do processador de anotações Lombok da N2-1.

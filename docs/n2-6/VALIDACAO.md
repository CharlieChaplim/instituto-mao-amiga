# Validação N2-6 — 13/11/2026

- npm run typecheck: passou.
- npm test: 25 testes passaram, zero falhas.
- npx expo export --platform web: exportação concluída.
- git diff --check: passou.

Cobertura: serviço HTTP, CRUD do serviço de doações, filtro, ordem cronológica,
bloqueio de páginas duplicadas, respostas fora de ordem, retry, lista vazia,
reinício ao retornar, POST com aviso, validação local, HTTP 400/conexão com
preservação de campos, histórico loading/erro/vazio/filtro e detalhe 404.
Mantidos testes de pontos e diálogos.

Interface testada em React Native Web/JSDOM com HTTP simulado. O retorno por
foco é simulado; não substitui navegação real. Não houve validação visual nem
execução contra a API real nesta etapa. Backend inalterado, suíte Maven não
reexecutada. Siga o roteiro manual antes do merge.

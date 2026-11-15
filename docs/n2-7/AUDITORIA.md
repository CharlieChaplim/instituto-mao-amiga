# Organização e evidências — 15/11/2026

## Removido

- src/services/doacoesStorage.ts: CRUD local da N1 sem consumidores nas telas.
  Testes foram ajustados para observar ausência de escrita no localStorage.
- src/screens/TelaDoacoes.tsx: alias legado sem imports e fora da navegação.
- Texto repetido/desatualizado no README principal: endpoints antigos, avisos
  de incompatibilidade e pendências de imagens já resolvidas.

## Atualizado e preservado

README principal com estado atual, execução, endpoints e todas as 14 imagens;
roteiro de demonstração alinhado à API; notas históricas de N2-5/N2-6 corrigidas.
Preservados relatórios, imagens, testes Java, assets referenciados pelo Expo,
ItemDetalhe usado pela tela de pontos e o enunciado histórico docs/issues/ISSUE-06.md.
Mantida dependência AsyncStorage, prevista para favoritos N2-8 (#23).
Nenhum banco/data, dado antigo do aparelho ou histórico Git foi apagado.
node_modules, builds/target e arquivos de banco continuam ignorados pelo Git.

## Prints

N2-1: sete capturas, cobrindo GET lista, POST, GET ID, PUT, DELETE, POST 400 e GET 404.
N2-5: sete capturas, cobrindo GET filtro, POST, GET ID, PUT, DELETE, POST 400 e GET 404.
A listagem de doações corrigida mostra 200 e content/page com banco vazio.

Não falta print para a cobertura mínima desses endpoints com um 400 e um 404.
Não foram encontrados prints de PUT inválido e PUT inexistente, em nenhum dos
dois grupos. São evidências adicionais recomendadas: a funcionalidade precisa
passar nesses casos, mas as issues não pedem expressamente cada combinação em
imagem. Os testes Java existentes cobrem esses cenários; não foram reexecutados
nesta entrega, pois o backend não mudou.

N2-7 não exige capturas. A ausência de imagens de interface não é tratada como
falha desse critério; a conferência manual continua necessária.

# N2-6 — issue #21

Base: main `d630992`. Apenas o app e a documentação mudam nesta etapa.

## Executar

Na pasta `api/`, Java 21: `mvnw.cmd spring-boot:run` (Windows) ou
`bash mvnw spring-boot:run` (Linux). Use uma única instância para não travar H2.
Na raiz: `npm ci`, `npm run typecheck`, `npm test`, `npx expo start --web --clear`.
A URL em `src/services/api.ts` inclui `/api/v1`. Para celular físico, troque
localhost pelo IP do computador na mesma rede; Android Emulator usa 10.0.2.2.

## Conferência local

1. Abra Minhas doações: com banco vazio, aparece mensagem de nenhuma doação.
2. Crie uma doação escolhendo um ponto carregado da API. Campos vazios e
   quantidade zero não devem enviar POST. Confirme o aviso de sucesso.
3. Ao voltar, confira a nova doação no topo, sem reiniciar o app. O filtro ativo
   permanece; limpe-o para ver itens que não correspondam a ele.
4. Cadastre mais de 10 doações; role o histórico para carregar a próxima página.
   Na rede, confira `page=0`, depois `page=1`, sem repetir itens.
5. Filtre por tipo: confira `filtro` na requisição e página reiniciada em zero.
6. Desligue a API: confira erro e Tentar novamente. Religue e tente novamente.
7. Com formulário preenchido, desligue a API antes de salvar: os campos devem
   continuar preenchidos e deve aparecer erro, sem aviso de sucesso.
8. Abra uma doação pelo histórico: o detalhe consulta seu UUID pela API.
9. Reinicie a API e confirme persistência. Não apague `api/data/`.

Edição e exclusão de doações na interface ficam para #22. O detalhe é somente
consulta nesta etapa. As funções de serviço editar/excluir já estão prontas.
O arquivo doacoesStorage.ts é legado sem uso nas telas; não apagamos dados
locais nem fazemos migração automática.

## Evidências

Os prints de Swagger enviados pelo autor estão organizados no README principal.
O print de listagem 500 precisa ser substituído por 200. Os prints da N2-1 são
de endpoints diferentes e continuam pendentes.

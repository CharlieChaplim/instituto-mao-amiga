# N2-7 — Editar e excluir doação pela API (#22)

Base: main 9ce6bb1, com N2-6 integrada.

O detalhe e a edição recebem apenas doacaoId e consultam GET pelo UUID. Cadastro
reutilizado, com botão Salvar alterações. PUT envia somente tipoItem, quantidade
e pontoDestino, preservando ID/data no servidor. Detalhe e histórico consultam
novamente a API ao receber foco. DELETE pede Cancelar/Excluir e volta após 204
mais confirmação do aviso. Há trava contra múltiplos envios. Erros não navegam.
Se um ponto antigo foi removido/renomeado, a edição pode manter o nome de destino
já registrado; destinos novos continuam sendo selecionados na API.

## Conferência local

1. Ligue a API (Java 21, em api/: mvnw.cmd spring-boot:run).
2. Na raiz: npm ci, npm run typecheck, npm test, npx expo start --web --clear.
3. Cadastre uma doação pelo app. Abra o detalhe e anote UUID/data.
4. Edite quantidade para 5; confira formulário preenchido, aviso de sucesso,
   detalhe atualizado com mesmo UUID/data, e histórico atualizado ao voltar.
5. Edite novamente e cancele: não deve haver PUT nem alteração.
6. Exclua: cancele primeiro; depois confirme. Após OK, confira ausência no histórico.
7. Apague uma doação via Swagger enquanto seu formulário está aberto no app:
   salvar deve falhar sem sucesso falso. Reabrir o detalhe mostra não encontrada.
8. Desligue a API depois de carregar o formulário/detalhe: salvar/excluir devem
   mostrar erro, preservar o estado e permitir nova tentativa após religar.
9. Faça a conferência em Android/iOS para validar Alert.alert; na web há Modal.

N2-7 não pede prints explicitamente. Se desejar evidenciar a apresentação,
capture formulário preenchido, detalhe editado, confirmação de exclusão e erro
com a API desligada. Não há imagens simuladas nem novas capturas nesta entrega.

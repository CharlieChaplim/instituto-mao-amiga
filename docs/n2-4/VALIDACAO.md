# Validação — 12/11/2026

- `npm run typecheck`: passou.
- `npm test`: 17 testes passaram; 0 falhas, 0 ignorados.
- `npx expo export --platform web`: bundle web gerado com sucesso.
- `git diff --check`: passou.

## Cobertura

Os sete testes da N2-3 continuam passando. Os dez testes novos montam componentes
React Native Web reais em DOM simulado (JSDOM + Testing Library), com diálogos
reais do `AvisosProvider`. O AsyncStorage web usa o localStorage do DOM de teste.
As respostas HTTP e a navegação são controladas no teste; não usam o banco do usuário.

Casos novos:

1. Cadastro de doação grava e mostra item/quantidade; só volta após OK.
2. Validação de doação mostra aviso e não grava.
3. Cancelar exclusão preserva doação; confirmar remove e mostra sucesso.
4. Erro de armazenamento na exclusão preserva registro e tela.
5. Campos obrigatórios e resposta 400 em pontos: formulário preservado.
6. Cadastro envia o tipo escolhido e bloqueia envio duplo.
7. Edição preenche o formulário e usa PUT com o mesmo ID.
8. Cancelar exclusão de ponto não envia DELETE; confirmar aceita 204.
9. Falha de conexão ao salvar ou excluir ponto não mostra sucesso nem navega.
10. Caminho nativo chama Alert.alert com Cancelar/Excluir e resolve a escolha.

## Limites

Os testes DOM não validam aparência, teclado ou gestos em um navegador/aparelho
real. A navegação completa e atualização visual ao recuperar foco ainda devem
ser conferidas pelo roteiro local. O teste do caminho nativo simula Platform e
Alert; não representa execução em Android/iOS físico.

O runner emite avisos conhecidos do ambiente simulado: ausência de ResizeObserver
para medição de layout e depreciação de pointerEvents em dependência. Eles não
causaram falhas. A implementação não depende de medições JSDOM para seu funcionamento.

Não houve mudança na API nesta issue. A integração HTTP real dos serviços foi
validada na N2-3; esta entrega valida os novos fluxos de interface com respostas
HTTP controladas, incluindo 400, falha de rede e 204.

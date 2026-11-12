# N2-4 — CRUD de pontos no app e correção dos avisos (#19)

Depende da N2-3 (#18). Não altera a API nem migra as doações para o servidor.

## Funcionalidades

- Botão Cadastrar ponto na lista.
- Formulário único `TelaCadastroPonto` para cadastro e edição: nome, endereço,
  bairro, horário e seleção entre coleta e distribuição por TouchableOpacity.
- Validação de campos antes do envio; POST no cadastro e PUT na edição.
- Na edição, dados buscados por UUID, formulário preenchido e botão Salvar alterações.
- Botões Editar ponto e Excluir ponto no detalhe. Exclusão confirmada antes do DELETE.
- Lista e detalhe recarregam ao recuperar foco, aproveitando o `useFocusEffect`
  da N2-3. Em uma lista filtrada, continuam aparecendo apenas os pontos que
  correspondem à busca; limpe a busca para ver todos.
- Falhas 400 ou de conexão mantêm o formulário preenchido e mostram o erro.
- Travas síncronas e botões desabilitados durante envio/diálogo evitam duplicação.

## Bug dos avisos e da exclusão no navegador

Na versão instalada de `react-native-web` (0.21.2), `Alert.alert` tem implementação
vazia. Assim, o aviso de sucesso não aparecia e a confirmação nunca acionava o
callback de exclusão. O cadastro podia já ter sido gravado, embora não houvesse
aviso nem retorno à tela anterior.

`AvisosProvider` resolve os avisos e confirmações em dois ambientes:

- Web: Modal da aplicação, com texto e botões OK ou Cancelar/Excluir. Não depende
  de pop-up nem de permissões para janelas do navegador.
- Android/iOS: `Alert.alert`, mantendo as opções Cancelar e Excluir.

Todas as telas de doação passaram a usar esse mecanismo, inclusive validações
e erros do histórico. Sucesso só é mostrado após a operação terminar, com o nome
do ponto ou o tipo/quantidade da doação. Após OK, a tela volta e o histórico/lista
se atualiza ao recuperar foco. Cancelar uma exclusão não modifica os dados.

As doações continuam no AsyncStorage, como exigido até a N2-6.

## Executar e validar

Na raiz, após aplicar o patch:

```bat
npm ci
npm run typecheck
npm test
```

Mantenha a API ligada em outro terminal:

```bat
cd api
mvnw.cmd spring-boot:run
```

Na raiz, inicie o app com cache limpo:

```bat
npx expo start --web --clear
```

A URL em `src/services/api.ts` permanece `http://localhost:8080/api/v1` para web.
Para celular físico, use o IP do computador e mantenha `/api/v1`.

## Roteiro de aceite local

1. Cadastrar ponto sem preencher: aparece aviso e não envia POST.
2. Preencher todos os campos, escolher distribuição e cadastrar: aviso com nome.
   Após OK, conferir na lista (limpar busca/rolar se necessário).
3. Abrir o detalhe, editar e salvar: mesmo formulário preenchido, mesmo UUID,
   detalhe e lista com os novos dados ao voltar.
4. Excluir ponto e cancelar: registro permanece. Confirmar: DELETE, aviso e retorno
   à lista sem o ponto. O DELETE 204 sem corpo não é tratado como falha.
5. Desligar a API durante edição: aviso de erro e texto digitado preservado.
   Religar a API e enviar novamente. Testar também erro ao excluir.
6. Cadastrar doação: aparece aviso com quantidade e tipo. Após OK, conferir o histórico.
7. Editar uma doação: aparece aviso de atualização. Excluir e cancelar: permanece.
   Confirmar: aparece aviso de exclusão e o registro some do histórico após OK.
8. Fechar/reabrir o app: conferir persistência das doações restantes.
9. Repetir confirmação/cancelamento no aparelho se a entrega incluir teste mobile.

Resultados automatizados: [VALIDACAO.md](VALIDACAO.md).

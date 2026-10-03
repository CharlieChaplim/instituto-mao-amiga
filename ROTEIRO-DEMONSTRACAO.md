# Roteiro de Demonstração — Instituto Mão Amiga

## Duração aproximada: 3 minutos

### 1. Tela inicial

Mostrar os pontos de coleta e os botões **Criar doação** e **Minhas doações**.

### 2. Registrar uma doação

Abrir o cadastro, informar tipo do item, quantidade e ponto de destino e registrar a doação. Mostrar também a validação dos campos.

### 3. Histórico

Abrir **Minhas doações** e mostrar que a doação aparece com tipo, quantidade, destino, data e hora. Explicar que as doações são salvas localmente com AsyncStorage.

### 4. Resumo

Mostrar a seção de resumo com o total de registros e os totais agrupados por tipo. Explicar que esses valores são calculados a partir das doações salvas, sem manter uma segunda cópia dos totais no armazenamento.

### 5. Filtro

Pesquisar parte do nome de um tipo de item. Mostrar que a lista muda enquanto o texto é digitado, que maiúsculas e minúsculas não interferem e que apagar a busca exibe todos os registros novamente. O resumo continua representando o histórico completo.

### 6. Detalhe e edição

Abrir uma doação, mostrar seus dados, selecionar **Editar doação**, alterar uma informação e salvar. Confirmar que o mesmo registro foi atualizado sem criar uma duplicata e que o resumo acompanha a alteração.

### 7. Exclusão

Abrir uma doação, selecionar **Excluir doação**, mostrar a confirmação e concluir a exclusão. Voltar ao histórico e confirmar que a lista e o resumo foram atualizados.

### 8. Persistência

Fechar completamente o aplicativo, abrir novamente e mostrar que as doações restantes continuam armazenadas.

## Decisões técnicas

- O acesso ao AsyncStorage está concentrado em `src/storage/doacoesStorage.ts`.
- O histórico usa `FlatList`.
- O filtro mantém apenas o texto pesquisado em estado e calcula a lista filtrada a partir das doações existentes.
- O resumo é calculado a partir do array de doações e não é persistido separadamente.
- As telas e os tipos ficam separados por responsabilidade dentro de `src/`.

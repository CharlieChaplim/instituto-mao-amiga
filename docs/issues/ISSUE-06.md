# Issue #06: Layout responsivo do app individual

## Contexto

As telas do app hoje só foram testadas no aparelho de quem programou. Em outro tamanho de tela, o layout pode quebrar (texto cortado, botão fora da tela, campo coberto pelo teclado). A lista e o detalhe de pontos de coleta já nasceram com parte dessa proteção desde a Aula 08; a tela de cadastro de doação, construída na Aula 12, ainda não tinha esse cuidado.

## Objetivo

Auditar as três telas do app (lista de pontos, detalhe de ponto, cadastro de doação) contra três perguntas, e corrigir o que a auditoria encontrar:

1. Existe algum valor de tamanho fixo em pixels que deveria ser relativo, ou usar `aspectRatio`?
2. Existe algum elemento tocável abaixo de 44x44 pixels CSS (critério 2.5.5 da WCAG)?
3. Existe algum campo de formulário que o teclado pode cobrir, sem `KeyboardAvoidingView` protegendo a tela?

Na maioria dos projetos, o problema real está na pergunta 3, na tela de cadastro de doação: o teclado cobre o último campo do formulário. A correção é envolver a tela com `SafeAreaView` (`edges={['bottom', 'left', 'right']}`, sem `'top'` porque o cabeçalho de navegação já cobre essa área) e `KeyboardAvoidingView` (`behavior="padding"` no iOS, `"height"` no Android).

## Cenários / Critérios de aceite

- [ ] O layout do app é testado em pelo menos 2 tamanhos de tela distintos (2 aparelhos físicos diferentes, ou 1 aparelho + 1 emulador com resolução diferente).
- [ ] Nenhum elemento fica cortado, sobreposto ou fora da área visível em nenhuma das duas resoluções testadas.
- [ ] Nenhum campo de formulário fica coberto pelo teclado em nenhuma das duas resoluções testadas.

## Fora de escopo

Novas telas ou funcionalidades. Hoje é só ajuste de layout do que já existe.

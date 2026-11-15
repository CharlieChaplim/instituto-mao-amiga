# Demonstração — estado N2-7 (até 3 minutos)

1. **0:00–0:35:** buscar um ponto por bairro; cadastrar um ponto de teste,
   editar e excluir com confirmação.
2. **0:35–1:10:** cadastrar uma doação, selecionando destino da API. Mostrar
   o aviso e a nova doação no histórico; buscar por tipo.
3. **1:10–1:55:** abrir a doação, editar a quantidade e salvar. Mostrar
   detalhe atualizado, mesmo UUID/data, e histórico atualizado ao voltar.
4. **1:55–2:20:** excluir a doação, cancelar primeiro e depois confirmar.
   Mostrar que desaparece do histórico.
5. **2:20–2:50:** no Swagger, POST inválido com quantidade zero (400) e
   GET do UUID excluído (404).
6. **2:50–3:00:** explicar que pontos/doações ficam no servidor H2; o app
   centraliza HTTP em api.ts e recarrega as telas ao receber foco.

Próxima etapa N2-8 (#23): acrescentar favoritos locais e ajustar este roteiro
para demonstrá-los. Não apresentar favoritos como implementados nesta entrega.

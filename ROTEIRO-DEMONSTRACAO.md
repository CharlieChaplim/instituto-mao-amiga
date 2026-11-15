# Demonstração final — até 3 minutos

## Preparação (antes de iniciar o cronômetro)

Ligue a API e o app, deixe Swagger aberto, prepare os corpos JSON válidos e um
POST inválido. Tenha pelo menos um ponto disponível para destino e favorito.
Use registros de demonstração para as exclusões. Ensaie a sequência.

| Tempo | Ação |
|---|---|
| 0:00–0:40 | Buscar por bairro; cadastrar, editar e excluir um ponto de teste |
| 0:40–1:00 | Marcar ♡ em outro ponto; abrir Meus pontos e mostrar ♥ |
| 1:00–1:50 | Cadastrar doação; abrir histórico/detalhe; editar quantidade; mostrar ID/data preservados; excluir |
| 1:50–2:35 | Swagger: POST de doação com quantidade 0 (400), GET do UUID excluído (404) |
| 2:35–3:00 | Explicar a decisão técnica abaixo |

## Explicação para dominar

Pontos e doações ficam na API porque são os dados do sistema, com validação e
persistência no H2. Favoritos são uma preferência local; o AsyncStorage guarda
só UUIDs. Ao abrir Meus pontos, consultamos cada ID na API para obter os dados
atuais. Se o ponto foi excluído, ignoramos seu 404 sem derrubar a tela. Um erro
de rede não é tratado como exclusão: mostramos erro e permitimos tentar novamente.

Na web, esse armazenamento é associado à origem do site. Em outro navegador,
aparelho ou origem, a lista local de favoritos pode ser diferente.

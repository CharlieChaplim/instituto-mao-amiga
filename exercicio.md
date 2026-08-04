# Exercício Prático — Aula 03

**Nome:** José Roberto Santos Nascimento
**Data:** 04/08/2026

## 1. Qual prop nova você acrescentou?

Acrescentei a prop `categoria`, que representa o tipo ao qual o produto
pertence, como móveis, iluminação ou acessórios.

## 2. Qual estado novo você acrescentou?

Acrescentei o estado `quantidade`. Ele começa em zero e muda quando o usuário
pressiona os botões de aumentar ou diminuir a quantidade do produto.

## 3. Por que cada dado foi definido como prop ou estado?

A categoria foi definida como prop porque vem da lista de produtos e o
`ProdutoItem` somente exibe essa informação. A quantidade foi definida como
estado porque pertence a cada item e pode mudar durante o uso do aplicativo.

## 4. Código da extensão do ProdutoItem

```jsx
function ProdutoItem({ produto, categoria }) {
  const [favorito, setFavorito] = useState(false);
  const [quantidade, setQuantidade] = useState(0);

  function diminuirQuantidade() {
    if (quantidade > 0) {
      setQuantidade(quantidade - 1);
    }
  }

  return (
    <View style={styles.item}>
      <Image source={{ uri: produto.imagem }} style={styles.imagem} />

      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.categoria}>{categoria}</Text>
        <Text style={styles.preco}>{produto.preco}</Text>

        <View style={styles.quantidade}>
          <Button
            title="-"
            onPress={diminuirQuantidade}
            disabled={quantidade === 0}
          />

          <Text style={styles.numero}>{quantidade}</Text>

          <Button
            title="+"
            onPress={() => setQuantidade(quantidade + 1)}
          />
        </View>
      </View>

      <Button
        title={favorito ? '♥' : '♡'}
        onPress={() => setFavorito(!favorito)}
      />
    </View>
  );
}
```
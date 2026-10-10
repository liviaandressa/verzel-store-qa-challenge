# Coleção Postman — Testes Manuais de API

Esta pasta destina-se a armazenar a **coleção do Postman** utilizada nos testes
manuais da API da Verzel Store (história VZS-142) e, opcionalmente, o
**environment** com as variáveis de ambiente.

> Nenhuma coleção exportada ou resultado de execução foi incluído
> automaticamente. Os arquivos devem ser exportados e versionados pela candidata.

## Endpoints exercitados

| Método | Endpoint | Finalidade |
|--------|----------|-----------|
| GET | `/api/produtos` | Listar o catálogo de produtos. |
| GET | `/api/produtos/{id}` | Consultar um produto específico. |
| POST | `/api/carrinho/calcular` | Calcular subtotal, desconto, frete e total. |
| POST | `/api/pedidos` | Fechar um pedido. |

URL base: `https://verzel-store.qa-test-verzel-store.workers.dev`

## Como exportar a coleção do Postman

1. No Postman, selecione a coleção utilizada nos testes (ex.: "Verzel Store — VZS-142").
2. Clique nos três pontos (**⋯**) ao lado do nome da coleção e escolha **Export**.
3. Selecione o formato **Collection v2.1** (recomendado).
4. Salve o arquivo nesta pasta com o nome:

   ```
   postman/verzel-store.postman_collection.json
   ```

5. (Opcional) Para exportar o environment: ícone de engrenagem **⚙** →
   **Environments** → **⋯** → **Export**, salvando como:

   ```
   postman/verzel-store.postman_environment.json
   ```

## Como armazenar e versionar

1. Coloque os arquivos exportados nesta pasta (`postman/`).
2. Adicione-os ao controle de versão:

   ```bash
   git add postman/verzel-store.postman_collection.json
   git commit -m "Adiciona coleção Postman dos testes de API"
   ```

3. Caso o environment contenha dados sensíveis, remova-os antes de versionar.

## Como importar a coleção

1. No Postman: **Import** → **Upload Files**.
2. Selecione `postman/verzel-store.postman_collection.json`.
3. (Opcional) Importe também o environment e selecione-o no seletor do canto
   superior direito.

## Como exportar resultados de execução (Collection Runner)

1. Abra o **Collection Runner** e execute a coleção.
2. Ao final, use **Export Results** para salvar o relatório em JSON.
3. Armazene o relatório em `evidencias/api/` e registre-o em
   `evidencias/indice-evidencias.md`.

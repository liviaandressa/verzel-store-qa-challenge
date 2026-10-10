# BUG-001 — Limite de 5 unidades por produto não é aplicado na API

| Campo | Valor |
|-------|-------|
| Identificador | BUG-001 |
| Título | Limite de 5 unidades por produto não é aplicado em `POST /api/carrinho/calcular` |
| Funcionalidade | Carrinho — cálculo de valores |
| Critério de aceite violado | **CA10** — "Cada produto pode ter no máximo 5 unidades por pedido. A regra vale para a interface e para a API." |
| Endpoint | `POST /api/carrinho/calcular` |
| Ambiente | https://verzel-store.qa-test-verzel-store.workers.dev |
| Severidade sugerida | **Alta** |
| Prioridade sugerida | Alta |
| Data de identificação | 2026-10-09 |

---

## Descrição

O critério de aceite **CA10** determina que cada produto pode ter no máximo
**5 unidades** por pedido, e que a regra vale tanto para a interface quanto para a
API. No entanto, o endpoint `POST /api/carrinho/calcular` aceita quantidades
muito superiores a 5 por produto, retornando **HTTP 200** e calculando subtotal,
desconto, frete e total com base na quantidade informada, em vez de retornar
**HTTP 422** com o código de erro `QUANTIDADE_MAXIMA_EXCEDIDA`.

O comportamento foi observado tanto com múltiplos produtos acima do limite quanto
com um único produto acima do limite (ex.: P001 × 6), caracterizando ausência da
validação na API.

## Pré-condições

- Ambiente de teste da Verzel Store disponível.
- Nenhuma autenticação ou estado prévio é necessário (não há controle de estoque).

## Passos de reprodução

1. Enviar uma requisição `POST` para `/api/carrinho/calcular` com o corpo:

   ```json
   {
     "itens": [
       { "produtoId": "P002", "quantidade": 50 },
       { "produtoId": "P004", "quantidade": 60 }
     ],
     "cupom": "BEMVINDO10"
   }
   ```

2. Observar o código de status HTTP e o corpo da resposta.


## Resultado esperado

- **HTTP 422 Unprocessable Entity**.
- Corpo da resposta com código de erro `QUANTIDADE_MAXIMA_EXCEDIDA`
  ("A quantidade de um produto é maior que 5."), sem cálculo de valores.

## Resultado obtido

- **HTTP 200 OK**.
- Corpo da resposta com o cálculo efetuado normalmente:

  ```json
  {
    "subtotal": 9989,
    "desconto": 998.9,
    "frete": 0,
    "freteGratis": true,
    "valorFaltanteFreteGratis": 0,
    "total": 8990.1,
    "cupom": {
      "codigo": "BEMVINDO10",
      "aplicado": true,
      "mensagem": "Cupom aplicado: 10% de desconto nos produtos."
    }
  }
  ```

> Observação: o defeito também se reproduz com um único produto acima do limite
> — por exemplo, `{"itens":[{"produtoId":"P001","quantidade":6}]}` retorna
> HTTP 200 em vez de HTTP 422.

## Impacto

- Permite a criação de carrinhos (e, potencialmente, pedidos) que violam a regra
  de negócio de 5 unidades por produto.
- Gera cálculo de valores sobre quantidades inválidas, comprometendo a
  integridade comercial da operação.
- Divergência de regra entre interface (que limita a 5) e API (que não limita),
  contrariando explicitamente o CA10.

## Severidade sugerida

**Alta** — defeito funcional que viola diretamente um critério de aceite da
história e afeta a confiabilidade do cálculo de pedidos na camada de API.

## Evidências

> As capturas/exportações devem ser anexadas em `evidencias/api/` e indexadas em
> `evidencias/indice-evidencias.md`. Sugestão de itens a anexar:
>
> - Requisição e resposta no Postman (status 200 + corpo).
> - Exportação da coleção/execução utilizada na reprodução.
>
> _Nenhuma captura foi incluída automaticamente; evidências pendentes de anexo._

## Cobertura automatizada

O cenário é coberto por `tests/carrinho.spec.ts`, que mantém a expectativa correta
(HTTP 422 / `QUANTIDADE_MAXIMA_EXCEDIDA`) e, portanto, **falha de propósito**
enquanto o defeito persistir — servindo como regressão executável do BUG-001.

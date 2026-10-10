import { test, expect } from '@playwright/test';
import { ENDPOINTS, CUPONS, PRODUTOS, REGRAS } from './constantes';

/**
 * Cenário automatizado 3 — Rejeição de quantidade superior a 5 unidades por produto.
 *
 * Critério de aceite coberto: CA10 (cada produto pode ter no máximo 5 unidades
 * por pedido; a regra vale para a interface e para a API).
 *
 * IMPORTANTE: a expectativa correta é HTTP 422 com o código
 * QUANTIDADE_MAXIMA_EXCEDIDA. Atualmente o ambiente apresenta o defeito
 * BUG-001 (ver bugs/BUG-001-limite-quantidade.md): a API responde HTTP 200 e
 * processa o cálculo. O teste foi mantido com a expectativa correta e, por isso,
 * FALHA de propósito enquanto o defeito não for corrigido. Não ajuste a
 * expectativa para fazê-lo passar — a falha é a evidência automatizada do bug.
 */
test.describe('Limite de quantidade por produto — POST /api/carrinho/calcular', () => {
  test('rejeita quantidade superior a 5 unidades de um mesmo produto (CA10)', async ({
    request,
  }) => {
    const quantidadeAcimaDoLimite = REGRAS.quantidadeMaximaPorProduto + 1; // 6

    const resposta = await request.post(ENDPOINTS.calcular, {
      data: {
        itens: [
          { produtoId: PRODUTOS.P001.id, quantidade: quantidadeAcimaDoLimite },
        ],
      },
    });

    // Expectativa correta segundo a documentação (CA10).
    expect(resposta.status()).toBe(422);

    const corpo = await resposta.json();
    expect(corpo.erro ?? corpo.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  test('rejeita o cenário do BUG-001: P002 x50 e P004 x60 com cupom BEMVINDO10 (CA10)', async ({
    request,
  }) => {
    const resposta = await request.post(ENDPOINTS.calcular, {
      data: {
        itens: [
          { produtoId: PRODUTOS.P002.id, quantidade: 50 },
          { produtoId: PRODUTOS.P004.id, quantidade: 60 },
        ],
        cupom: CUPONS.valido,
      },
    });

    // Expectativa correta segundo a documentação (CA10), mantida apesar do defeito.
    expect(resposta.status()).toBe(422);

    const corpo = await resposta.json();
    expect(corpo.erro ?? corpo.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });
});

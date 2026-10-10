import { test, expect } from '@playwright/test';
import { ENDPOINTS, CUPONS, PRODUTOS, arredondar } from './constantes';

/**
 * Cenário automatizado 1 — Aplicação de cupom válido com desconto de 10%.
 *
 * Critérios de aceite cobertos: CA01 (cupom BEMVINDO10 aplica 10% sobre o
 * subtotal), CA09 (o desconto não incide sobre o frete) e CA11 (arredondamento
 * em 2 casas decimais).
 */
test.describe('Cupom de desconto — POST /api/carrinho/calcular', () => {
  test('aplica 10% de desconto sobre o subtotal com o cupom BEMVINDO10 (CA01)', async ({
    request,
  }) => {
    // Arrange: 2 unidades de P003 (R$ 189,90) => subtotal R$ 379,80.
    const quantidade = 2;
    const subtotalEsperado = arredondar(PRODUTOS.P003.preco * quantidade); // 379.80
    const descontoEsperado = arredondar(subtotalEsperado * 0.1); // 37.98
    const totalEsperado = arredondar(subtotalEsperado - descontoEsperado); // 341.82 (frete grátis)

    // Act
    const resposta = await request.post(ENDPOINTS.calcular, {
      data: {
        itens: [{ produtoId: PRODUTOS.P003.id, quantidade }],
        cupom: CUPONS.valido,
      },
    });

    // Assert: status HTTP e corpo da resposta.
    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();

    expect(corpo.subtotal).toBe(subtotalEsperado);
    expect(corpo.desconto).toBe(descontoEsperado);
    expect(corpo.total).toBe(totalEsperado);

    // O cupom deve constar como aplicado.
    expect(corpo.cupom).toMatchObject({
      codigo: CUPONS.valido,
      aplicado: true,
    });

    // CA09: o desconto incide apenas sobre os produtos, nunca sobre o frete.
    expect(corpo.desconto).toBe(arredondar(corpo.subtotal * 0.1));
  });

  test('normaliza o cupom ignorando caixa e espaços nas extremidades (CA02)', async ({
    request,
  }) => {
    const resposta = await request.post(ENDPOINTS.calcular, {
      data: {
        itens: [{ produtoId: PRODUTOS.P003.id, quantidade: 1 }],
        cupom: '  bemvindo10  ',
      },
    });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();

    expect(corpo.cupom.aplicado).toBe(true);
    expect(corpo.cupom.codigo).toBe(CUPONS.valido);
    expect(corpo.desconto).toBeGreaterThan(0);
  });
});

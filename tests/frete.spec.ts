import { test, expect } from '@playwright/test';
import { ENDPOINTS, PRODUTOS, REGRAS, arredondar } from './constantes';

/**
 * Cenário automatizado 2 — Regra de frete grátis.
 *
 * Critérios de aceite cobertos: CA06 (frete grátis a partir de R$ 200,00,
 * inclusive), CA07 (abaixo de R$ 200,00 cobra-se frete fixo de R$ 19,90 e
 * informa-se o valor faltante) e CA08 (o frete grátis considera o subtotal
 * antes do desconto do cupom).
 */
test.describe('Frete grátis — POST /api/carrinho/calcular', () => {
  test('concede frete grátis quando o subtotal é igual ou superior a R$ 200,00 (CA06)', async ({
    request,
  }) => {
    // 2 unidades de P003 (R$ 189,90) => subtotal R$ 379,80 (>= 200).
    const quantidade = 2;
    const subtotalEsperado = arredondar(PRODUTOS.P003.preco * quantidade);
    expect(subtotalEsperado).toBeGreaterThanOrEqual(REGRAS.limiteFreteGratis);

    const resposta = await request.post(ENDPOINTS.calcular, {
      data: { itens: [{ produtoId: PRODUTOS.P003.id, quantidade }] },
    });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();

    expect(corpo.subtotal).toBe(subtotalEsperado);
    expect(corpo.frete).toBe(0);
    expect(corpo.freteGratis).toBe(true);
    expect(corpo.valorFaltanteFreteGratis).toBe(0);
  });

  test('cobra frete fixo de R$ 19,90 e informa o valor faltante quando o subtotal é inferior a R$ 200,00 (CA07)', async ({
    request,
  }) => {
    // 1 unidade de P001 (R$ 59,90) => subtotal R$ 59,90 (< 200).
    const resposta = await request.post(ENDPOINTS.calcular, {
      data: { itens: [{ produtoId: PRODUTOS.P001.id, quantidade: 1 }] },
    });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();

    const faltanteEsperado = arredondar(
      REGRAS.limiteFreteGratis - corpo.subtotal,
    );

    expect(corpo.frete).toBe(REGRAS.freteFixo);
    expect(corpo.freteGratis).toBe(false);
    expect(corpo.valorFaltanteFreteGratis).toBe(faltanteEsperado);
  });

  test('mantém o frete grátis considerando o subtotal antes do desconto do cupom (CA08)', async ({
    request,
  }) => {
    // Subtotal R$ 379,80 (>= 200) mesmo que o cupom reduza o total.
    const resposta = await request.post(ENDPOINTS.calcular, {
      data: {
        itens: [{ produtoId: PRODUTOS.P003.id, quantidade: 2 }],
        cupom: 'BEMVINDO10',
      },
    });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();

    expect(corpo.desconto).toBeGreaterThan(0);
    expect(corpo.frete).toBe(0);
    expect(corpo.freteGratis).toBe(true);
  });
});

/**
 * Constantes compartilhadas entre os testes de API da Verzel Store.
 *
 * Valores de produtos e regras de negócio refletem a documentação oficial da
 * história VZS-142 e foram confirmados contra a API em ambiente de teste.
 */

/** Endpoints documentados utilizados na automação. */
export const ENDPOINTS = {
  produtos: '/api/produtos',
  calcular: '/api/carrinho/calcular',
  pedidos: '/api/pedidos',
} as const;

/** Cupons documentados. */
export const CUPONS = {
  /** 10% de desconto sobre o subtotal. Vigente. */
  valido: 'BEMVINDO10',
  /** Cupom fora da validade (expirado em 31/03/2026). */
  expirado: 'VERAO2026',
} as const;

/** Regras de negócio relevantes (CA06, CA07, CA10). */
export const REGRAS = {
  limiteFreteGratis: 200,
  freteFixo: 19.9,
  quantidadeMaximaPorProduto: 5,
  percentualDescontoCupomValido: 0.1,
} as const;

/** Produtos fixos do catálogo (id e preço unitário em reais). */
export const PRODUTOS = {
  P001: { id: 'P001', nome: 'Camiseta Essencial', preco: 59.9 },
  P002: { id: 'P002', nome: 'Calça Jeans Slim', preco: 139.9 },
  P003: { id: 'P003', nome: 'Tênis Casual Urbano', preco: 189.9 },
  P004: { id: 'P004', nome: 'Boné Aba Curva', preco: 49.9 },
} as const;

/** Arredonda para 2 casas decimais, conforme CA11. */
export function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

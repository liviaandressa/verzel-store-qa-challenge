# Índice de Evidências

Este documento cataloga as evidências de execução dos testes, organizadas pelas
pastas correspondentes. Cada entrada referencia o cenário de teste definido em
`docs/cenarios-de-testes.md` (CT-01 a CT-31) e, quando aplicável, o defeito
relacionado em `bugs/`.

| Pasta | Conteúdo |
|-------|----------|
| `evidencias/api/` | Capturas de requisições/respostas de API (Postman / linha de comando). |
| `evidencias/interface/` | Capturas de tela e vídeos dos fluxos validados na interface web. |

> O campo **Status** indica o estado de anexação da evidência (Anexada / Pendente).
> O veredito de cada caso (Aprovado / Reprovado / Não executado) é registrado em
> `docs/execucao-dos-testes.md`.

## Convenção de nomenclatura

Cada arquivo de evidência é nomeado com o identificador do cenário (ou dos
cenários, quando a mesma captura/vídeo cobre mais de um), para rastreabilidade
direta com `docs/cenarios-de-testes.md`:

```
CT-01.png
CT-14-NEGATIVO.png
CT-17-18-19-20-21-22-23-24-25-31.mov
```

## Evidências de API

Pasta: `evidencias/api/` — endpoints `POST /api/carrinho/calcular`,
`POST /api/pedidos`, `GET /api/produtos` e `GET /api/produtos/{id}`.

| Arquivo | Cenário / Bug | Descrição | Status |
|---------|---------------|-----------|--------|
| `CT-01.png` | CT-01 | Cupom BEMVINDO10 aplica 10% de desconto | ✅ Anexada |
| `CT-02.png` | CT-02 | Cupom insensível a caixa e espaços | ✅ Anexada |
| `CT-03.png` | CT-03 | Cupom inexistente não aplica desconto | ✅ Anexada |
| `CT-04.png` | CT-04 | Cupom expirado não aplica desconto | ✅ Anexada |
| `CT-06.png` | CT-06 | Frete grátis para subtotal ≥ R$ 200,00 | ✅ Anexada |
| `CT-07.png` | CT-07 | Frete fixo e valor faltante abaixo de R$ 200,00 | ✅ Anexada |
| `CT-08.png` | CT-08 | Frete grátis considera o subtotal antes do desconto | ✅ Anexada |
| `CT-09.png` | CT-09 | Desconto não incide sobre o frete | ✅ Anexada |
| `CT-10.png` | CT-10 · BUG-001 | Limite de 5 unidades via API (retorna HTTP 200 em vez de 422) | ✅ Anexada |
| `CT-12.png` | CT-12 | Arredondamento em 2 casas decimais | ✅ Anexada |
| `CT-13.png` | CT-13 | Pedido com cupom inválido é rejeitado em `/api/pedidos` | ✅ Anexada |
| `CT-14.png` | CT-14 | Consulta de produtos — lista com 8 produtos (HTTP 200) | ✅ Anexada |
| `CT-14-NEGATIVO.png` | CT-14 | Consulta de produto por ID inexistente — HTTP 404 `PRODUTO_NAO_ENCONTRADO` | ✅ Anexada |

## Evidências de Interface

Pasta: `evidencias/interface/` — fluxos de carrinho, navegação e checkout na
interface web.

| Arquivo | Cenário / Bug | Descrição | Status |
|---------|---------------|-----------|--------|
| `CT-05.png` | CT-05 | Apenas um cupom aplicado por vez | ✅ Anexada |
| `CT-11.png` | CT-11 | Controle de quantidade desabilitado ao atingir 5 unidades | ✅ Anexada |
| `CT-15.png` | CT-15 | Adicionar produto ao carrinho | ✅ Anexada |
| `CT-16.png` | CT-16 | Atualizar indicador do carrinho após adição | ✅ Anexada |
| `CT-17.png` | CT-17 | Aumentar quantidade de produto no carrinho | ✅ Anexada |
| `CT-17-18-19-20-21-22-23-24-25-31.mov` | CT-17 a CT-25, CT-31 | Edição de quantidade, remoção individual, esvaziamento, carrinho vazio, atualização do indicador, navegação pelo menu e recálculo dos valores | ✅ Anexada |
| `CT-26.mov` | CT-26 | Abrir formulário ao clicar em Finalizar compra | ✅ Anexada |
| `CT-27.png` | CT-27 | Validar nome e sobrenome no checkout | ✅ Anexada |
| `CT-28.png` | CT-28 | Validar formato de e-mail no checkout | ✅ Anexada |
| `CT-29-30.mov` | CT-29, CT-30 | Validar CEP (com e sem hífen) e confirmar pedido com dados válidos | ✅ Anexada |

## Cobertura dos cenários

- **API (CT-01 a CT-04, CT-06 a CT-10, CT-12 a CT-14):** evidências anexadas.
- **Interface (CT-05, CT-11, CT-15 a CT-31):** evidências anexadas (capturas e vídeos).
- **CT-10** evidencia o defeito **BUG-001** (`bugs/BUG-001-limite-quantidade.md`):
  o limite de 5 unidades por produto não é aplicado pela API.

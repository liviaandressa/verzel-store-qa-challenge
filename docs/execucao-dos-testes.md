# Execução dos Testes — Verzel Store (VZS-142)

> **Nota de integridade das evidências.** Os resultados refletem execuções reais
> realizadas durante a preparação da entrega: os cenários de API via Postman /
> linha de comando (`POST /api/carrinho/calcular`, `POST /api/pedidos`,
> `GET /api/produtos` e `GET /api/produtos/{id}`) e os cenários de interface
> diretamente no navegador. As **capturas de tela e vídeos** que comprovam cada
> execução estão anexados nas pastas `evidencias/api/` e `evidencias/interface/` e
> catalogados em `evidencias/indice-evidencias.md`.

| Campo | Valor |
|-------|-------|
| Ambiente | https://verzel-store.qa-test-verzel-store.workers.dev |
| Período de execução | 2026-10-09 |
| Ferramentas | Postman / linha de comando (API); navegador (interface) |

---

## Resultados

| ID | Data | Resultado esperado | Resultado obtido | Status | Evidência |
|----|------|--------------------|------------------|--------|-----------|
| CT-01 | 2026-10-09 | HTTP 200; subtotal 379,80; desconto 37,98; total 341,82; cupom aplicado | HTTP 200; subtotal 379,80; desconto 37,98; total 341,82; `cupom.aplicado=true` | ✅ Aprovado | `evidencias/api/CT-01.png` |
| CT-02 | 2026-10-09 | HTTP 200; cupom normalizado para BEMVINDO10; desconto > 0 | HTTP 200; `cupom.codigo="BEMVINDO10"`; desconto 18,99 | ✅ Aprovado | `evidencias/api/CT-02.png` |
| CT-03 | 2026-10-09 | HTTP 200; aplicado=false; "Cupom inválido."; desconto 0 | HTTP 200; `aplicado=false`; mensagem "Cupom inválido."; desconto 0 | ✅ Aprovado | `evidencias/api/CT-03.png` |
| CT-04 | 2026-10-09 | HTTP 200; aplicado=false; "Cupom expirado."; desconto 0 | HTTP 200; `aplicado=false`; mensagem "Cupom expirado."; desconto 0 | ✅ Aprovado | `evidencias/api/CT-04.png` |
| CT-05 | 2026-10-09 | Interface exige remover o cupom antes de aplicar outro | Com BEMVINDO10 aplicado, a interface exibe "Remover cupom"; só permite um cupom por vez | ✅ Aprovado | `evidencias/interface/CT-05.png` |
| CT-06 | 2026-10-09 | HTTP 200; frete 0; freteGratis=true; faltante 0 | HTTP 200; frete 0; `freteGratis=true`; `valorFaltanteFreteGratis=0` | ✅ Aprovado | `evidencias/api/CT-06.png` |
| CT-07 | 2026-10-09 | HTTP 200; frete 19,90; freteGratis=false; faltante 140,10 | HTTP 200; frete 19,90; `freteGratis=false`; faltante 140,10 | ✅ Aprovado | `evidencias/api/CT-07.png` |
| CT-08 | 2026-10-09 | HTTP 200; desconto > 0; frete 0; freteGratis=true | HTTP 200; desconto 37,98; frete 0; `freteGratis=true` | ✅ Aprovado | `evidencias/api/CT-08.png` |
| CT-09 | 2026-10-09 | HTTP 200; desconto 18,99; frete 19,90; total 190,81 | HTTP 200; desconto 18,99; frete 19,90; total 190,81 | ✅ Aprovado | `evidencias/api/CT-09.png` |
| CT-10 | 2026-10-09 | HTTP 422; erro QUANTIDADE_MAXIMA_EXCEDIDA | HTTP 200; subtotal 9989; desconto 998,9; frete 0; total 8990,1 (limite ignorado) | ❌ Reprovado | **BUG-001** · `evidencias/api/CT-10.png` |
| CT-11 | 2026-10-09 | Controle de aumento desabilitado ao atingir 5 unidades | Em 5 unidades exibe "Limite de 5 unidades por produto." e o controle de aumentar fica desabilitado | ✅ Aprovado | `evidencias/interface/CT-11.png` |
| CT-12 | 2026-10-09 | HTTP 200; valores com no máximo 2 casas decimais | HTTP 200; valores com 2 casas (ex.: desconto 18,99) | ✅ Aprovado | `evidencias/api/CT-12.png` |
| CT-13 | 2026-10-09 | HTTP 422; erro CUPOM_INVALIDO / CUPOM_EXPIRADO em `/api/pedidos` | HTTP 422; `erro.codigo=CUPOM_INVALIDO`; mensagem "Cupom inválido."; campo "cupom" | ✅ Aprovado | `evidencias/api/CT-13.png` |
| CT-14 | 2026-10-09 | Lista com 8 produtos; id inexistente retorna 404 | HTTP 200 com lista de 8 produtos; `GET /api/produtos/PXXX` retorna HTTP 404 `PRODUTO_NAO_ENCONTRADO` | ✅ Aprovado | `evidencias/api/CT-14.png`, `CT-14-NEGATIVO.png` |

### Legenda de status

- ✅ **Aprovado** — resultado obtido igual ao esperado.
- ❌ **Reprovado** — resultado obtido diferente do esperado (defeito).
- ⛔ **Bloqueado** — execução impedida por dependência/ambiente.
- ⏳ **Não executado** — pendente de execução/validação manual.

## Resumo quantitativo

| Status | Quantidade |
|--------|-----------|
| Aprovado | 13 |
| Reprovado | 1 |
| Bloqueado | 0 |
| Não executado | 0 |
| **Total** | **14 casos** (CT-01 a CT-14) |

> O defeito identificado em **CT-10** está detalhado em
> `bugs/BUG-001-limite-quantidade.md` e também é coberto pela automação em
> `tests/carrinho.spec.ts`, que mantém a expectativa correta (HTTP 422) e,
> portanto, falha intencionalmente enquanto o defeito persistir.

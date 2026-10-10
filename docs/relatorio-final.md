# Relatório Final de Testes — Verzel Store (VZS-142)

| Item | Descrição |
|------|-----------|
| Projeto | Verzel Store — Desafio Técnico de QA |
| História | VZS-142 — Cupom de desconto e frete grátis |
| Ambiente | https://verzel-store.qa-test-verzel-store.workers.dev |
| Data do relatório | 2026-10-10 |
| Versão do documento | 1.1 |

---

## 1. Resumo executivo

A história **VZS-142** adiciona à Verzel Store a aplicação de cupons de desconto
no carrinho e a regra de frete grátis, com os cálculos realizados pela API. Foram
elaborados **14 cenários de teste** (CT-01 a CT-14) derivados dos critérios de
aceite CA01–CA11, cobrindo cupom, frete, limite de quantidade e arredondamento.

A maior parte das regras de cálculo está correta: a aplicação do cupom
(BEMVINDO10), a normalização de código, o tratamento de cupons inválidos/expirados,
a regra de frete grátis (incluindo a base de cálculo antes do desconto) e o
arredondamento comportam-se conforme o esperado. Foi identificado **1 defeito de
severidade alta (BUG-001)**: o endpoint `POST /api/carrinho/calcular` **não aplica
o limite de 5 unidades por produto (CA10)**, aceitando quantidades arbitrárias e
calculando valores com base nelas.

## 2. Cobertura dos requisitos

| Critério de aceite | Cenário(s) | Situação |
|--------------------|------------|----------|
| CA01 — Cupom BEMVINDO10 aplica 10% | CT-01 | ✅ Atendido |
| CA02 — Cupom ignora caixa/espaços | CT-02 | ✅ Atendido |
| CA03 — Cupom inexistente: "Cupom inválido." | CT-03 | ✅ Atendido |
| CA04 — Cupom expirado: "Cupom expirado." | CT-04 | ✅ Atendido |
| CA05 — Apenas um cupom por vez | CT-05 | ✅ Atendido (interface) |
| CA06 — Frete grátis ≥ R$ 200,00 | CT-06 | ✅ Atendido |
| CA07 — Frete fixo R$ 19,90 + valor faltante | CT-07 | ✅ Atendido |
| CA08 — Frete grátis sobre subtotal antes do desconto | CT-08 | ✅ Atendido |
| CA09 — Desconto não incide sobre o frete | CT-09 | ✅ Atendido |
| CA10 — Máximo de 5 unidades por produto | CT-10, CT-11 | ❌ Não atendido na API (BUG-001) |
| CA11 — Arredondamento em 2 casas | CT-12 | ✅ Atendido |

## 3. Resultados

| Status | Quantidade |
|--------|-----------|
| Aprovado | 13 |
| Reprovado | 1 |
| Bloqueado | 0 |
| Não executado | 0 |

Os 14 cenários (CT-01 a CT-14) foram executados; 13 aprovados e 1 reprovado
(CT-10, BUG-001). Detalhamento por cenário em `docs/execucao-dos-testes.md` e
evidências catalogadas em `evidencias/indice-evidencias.md`.

### Automação

Três cenários de maior valor foram automatizados em Playwright (`tests/`):

1. Aplicação de cupom válido com desconto de 10% (`cupom.spec.ts`).
2. Frete grátis para subtotal ≥ R$ 200,00 (`frete.spec.ts`).
3. Rejeição de quantidade superior a 5 unidades por produto (`carrinho.spec.ts`).

O cenário 3 mantém a expectativa correta (HTTP 422) e **falha intencionalmente**,
funcionando como regressão executável do BUG-001 até a correção.

## 4. Defeitos

| ID | Título | Severidade | Status | Referência |
|----|--------|-----------|--------|------------|
| BUG-001 | Limite de 5 unidades por produto não é aplicado na API | Alta | Aberto | `bugs/BUG-001-limite-quantidade.md` |

## 5. Riscos

| Risco | Impacto | Observação |
|-------|---------|------------|
| BUG-001 em produção | Pedidos com quantidades inválidas e valores incorretos | Viola CA10; recomenda-se correção antes da liberação. |
| Ambiente público instável | Possível bloqueio de execução | Mitigado com retentativa em CI e parametrização de URL. |

## 6. Conclusão

A entrega da história VZS-142 apresenta as regras de cupom e frete corretas na
API, mas **não deve ser considerada aprovada** enquanto o **BUG-001** persistir,
por violar diretamente o critério CA10, que exige o limite de 5 unidades por
produto tanto na interface quanto na API. Recomenda-se:

1. Corrigir a validação de quantidade máxima no endpoint `POST /api/carrinho/calcular`.
2. Reexecutar CT-10 (e a automação em `carrinho.spec.ts`) para confirmar a correção.
3. Manter o monitoramento dos demais cenários já validados (interface e
   `/api/pedidos`), cujas evidências estão anexadas em `evidencias/`.

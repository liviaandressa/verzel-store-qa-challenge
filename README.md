# Verzel Store — Desafio Técnico de QA

Repositório de entrega do desafio técnico de **QA Engineer** da Verzel. O projeto
reúne a documentação de qualidade, os cenários de teste, o relatório de defeitos,
as evidências e a automação de testes de API da história **VZS-142 — Cupom de
desconto e frete grátis**.

## Objetivo do desafio

Testar a funcionalidade de cupons de desconto e frete grátis da Verzel Store,
validando a aderência aos critérios de aceite documentados (CA01–CA11), registrar
os defeitos encontrados, produzir evidências de execução e automatizar ao menos
três cenários com Playwright.

## História e versão testadas

| Item | Detalhe |
|------|---------|
| História | **VZS-142** — Cupom de desconto e frete grátis |
| Aplicação | https://verzel-store.qa-test-verzel-store.workers.dev/ |
| Documentação | https://verzel-store.qa-test-verzel-store.workers.dev/documentacao |
| Escopo | Aplicação de cupom, regra de frete grátis e limite de quantidade por produto |

## Tecnologias utilizadas

- **Node.js** — ambiente de execução.
- **TypeScript** — linguagem da automação.
- **@playwright/test** — framework de testes (API).
- **Postman** — testes manuais de API.
- **Markdown** — documentação.
- **Git / GitHub** — controle de versão.

## Estrutura do repositório

```text
verzel-store-qa-challenge/
├── docs/                         # Documentação de qualidade
│   ├── plano-de-testes.md        # Objetivo, escopo, estratégia, riscos
│   ├── cenarios-de-teste.md      # Casos de teste + Gherkin (CA01–CA11)
│   ├── execucao-dos-testes.md    # Resultados por cenário e status
│   └── relatorio-final.md        # Resumo executivo e conclusão
├── bugs/
│   └── BUG-001-limite-quantidade.md   # Defeito do limite de 5 unidades (CA10)
├── evidencias/
│   ├── api/                      # Evidências de API 
│   ├── interface/                # Evidências de interface 
│   └── indice-evidencias.md      # Catálogo de evidências
├── postman/
│   └── README.md                 # Como exportar/armazenar a coleção
├── tests/                        # Automação Playwright (API)
│   ├── constantes.ts             # Dados e regras compartilhados
│   ├── cupom.spec.ts             # Cenário 1 — cupom válido (10%)
│   ├── frete.spec.ts             # Cenário 2 — frete grátis ≥ R$ 200
│   └── carrinho.spec.ts          # Cenário 3 — limite de 5 unidades (BUG-001)
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
└── README.md
```

## Organização dos entregáveis

| Entregável | Localização |
|------------|-------------|
| Cenários de teste (com Gherkin) | `docs/cenarios-de-teste.md` |
| Execução dos testes manuais/exploratórios | `docs/execucao-dos-testes.md` |
| Relatório de bugs | `bugs/` (e resumo em `docs/relatorio-final.md`) |
| Evidências de execução | `evidencias/` + `evidencias/indice-evidencias.md` |
| Automação (Playwright) | `tests/` |
| Testes de API (Postman) | `postman/` |

## Pré-requisitos

- **Node.js** 18 ou superior (LTS recomendado).
- **npm** (acompanha o Node.js).
- Acesso à internet (os testes exercitam a API pública da Verzel Store).

## Instalação

```bash
# 1. Instalar as dependências
npm install

# 2. Instalar os navegadores do Playwright (necessário na primeira execução)
npx playwright install
```

> A URL base pode ser sobrescrita via variável de ambiente `BASE_URL`, caso o
> ambiente de teste mude.

## Executar os testes Playwright

```bash
# Executar toda a suíte
npm test

# Executar um arquivo específico
npm run test:cupom      # cupom válido (10%)
npm run test:frete      # frete grátis
npm run test:carrinho   # limite de 5 unidades (reproduz o BUG-001)
```

> ⚠️ **O teste `carrinho.spec.ts` falha de propósito.** Ele mantém a expectativa
> correta (HTTP 422 / `QUANTIDADE_MAXIMA_EXCEDIDA`) e permanece vermelho enquanto
> o **BUG-001** não for corrigido. A falha é a evidência automatizada do defeito e
> **não deve ser ajustada** apenas para o teste passar.

## Visualizar relatórios de execução

O Playwright gera um relatório HTML após a execução:

```bash
npm run report
# ou
npx playwright show-report
```

O relatório é gravado em `playwright-report/` (ignorado pelo Git).

## Consultar bugs e evidências

- **Bugs:** veja `bugs/BUG-001-limite-quantidade.md` para a descrição completa,
  passos de reprodução e impacto. O resumo consolidado está em
  `docs/relatorio-final.md` (seção *Defeitos*).
- **Evidências:** os arquivos ficam em `evidencias/api/` e `evidencias/interface/`,
  catalogados em `evidencias/indice-evidencias.md`. As capturas de tela e
  exportações devem ser anexadas pela candidata (nenhuma evidência fictícia foi
  incluída).

## Resumo dos resultados

| Status | Quantidade |
|--------|-----------|
| Aprovado | 13 |
| Reprovado | 1 (BUG-001) |
| Não executado | 0 |
| **Total** | **14 casos** (CT-01 a CT-14) |

Consulte `docs/execucao-dos-testes.md` para o detalhamento por cenário.


## Utilização de Inteligência Artificial no Projeto

Durante o desenvolvimento deste desafio técnico, utilizei ferramentas de Inteligência Artificial (IA) como apoio ao planejamento, à documentação e à estruturação dos testes de qualidade de software.

A IA foi utilizada principalmente para:

- **Planejamento de testes:** auxiliar na interpretação dos requisitos, organização do plano de testes e identificação de cenários positivos, negativos e de valores-limite.
- **Elaboração de cenários:** apoiar a estruturação dos casos de teste, incluindo pré-condições, passos de execução, resultados esperados e cenários escritos em Gherkin.
- **Documentação:** auxiliar na organização dos arquivos Markdown, padronização dos registros de execução e elaboração dos relatórios de defeitos.
- **Automação:** apoiar a estruturação do projeto Playwright, a elaboração dos scripts e a definição das asserções com base nos critérios de aceite.
- **Análise de resultados:** auxiliar na conferência dos cálculos e na comparação entre os resultados obtidos e os comportamentos esperados.

A execução dos testes manuais, a investigação dos comportamentos da aplicação e a identificação de divergências foram conduzidas por mim, utilizando principalmente o Postman e a interface da Verzel Store.

Um exemplo foi a identificação de uma inconsistência na validação do limite máximo de cinco unidades por produto, posteriormente documentada como BUG-001.

**A Inteligência Artificial foi utilizada como ferramenta de suporte, e não como substituta da análise crítica e da tomada de decisão durante o processo de testes.** Os resultados foram avaliados com base na documentação oficial, nos critérios de aceite e nas evidências coletadas durante a execução.
# Cenários de Teste — Verzel Store (VZS-142)

Documento de cenários derivados dos critérios de aceite (CA01–CA11) da história **VZS-142 — Cupom de desconto e frete grátis**, além de testes funcionais complementares de interface, navegação, carrinho e checkout.

> Endpoint de cálculo: `POST /api/carrinho/calcular`
> Endpoint de listagem de produtos: `GET /api/produtos`
> Endpoint de produtos por ID: `GET /api/produtos/{id}`
> Endpoint de pedidos do cliente: `GET /api/produtos/{id}`



## Catálogo de referência

| ID | Produto | Preço |
|----|---------|-------|
| P001 | Camiseta Essencial | R$ 59,90 |
| P002 | Calça Jeans Slim | R$ 139,90 |
| P003 | Tênis Casual Urbano | R$ 189,90 |
| P004 | Boné Aba Curva | R$ 49,90 |
| P005 | Mochila Urbana 20L | R$ 100,00 |
| P006 | Kit 3 Pares de Meias | R$ 29,90 |
| P007 | Jaqueta Corta-Vento | R$ 229,90 |
| P008 | Garrafa Térmica 750ml | R$ 50,00 |

Cupons: **BEMVINDO10** (10% de desconto, vigente) · **VERAO2026** (expirado em 31/03/2026).

---

## Matriz de cenários

### CT-01 — Cupom BEMVINDO10 aplica 10% de desconto

| Campo | Valor |
|-------|-------|
| Identificador | CT-01 |
| Funcionalidade | Cupom de desconto |
| Critério de aceite | CA01 |
| Pré-condições | Carrinho com itens; cupom vigente disponível. |
| Dados utilizados | `itens`: P003 × 2; `cupom`: BEMVINDO10 |
| Passos | 1. Enviar `POST /api/carrinho/calcular` com os dados. 2. Inspecionar o corpo. |
| Resultado esperado | HTTP 200; `subtotal` 379,80; `desconto` 37,98; `total` 341,82; `cupom.aplicado = true`. |
| Técnica | Partição de equivalência |

### CT-02 — Cupom insensível a caixa e espaços

| Campo | Valor |
|-------|-------|
| Identificador | CT-02 |
| Funcionalidade | Cupom de desconto |
| Critério de aceite | CA02 |
| Pré-condições | Carrinho com itens. |
| Dados utilizados | `itens`: P003 × 1; `cupom`: `"  bemvindo10  "` |
| Passos | 1. Enviar `POST /api/carrinho/calcular`. 2. Verificar normalização. |
| Resultado esperado | HTTP 200; `cupom.codigo = "BEMVINDO10"`; `cupom.aplicado = true`; `desconto > 0`. |
| Técnica | Partição de equivalência |

### CT-03 — Cupom inexistente não aplica desconto

| Campo | Valor |
|-------|-------|
| Identificador | CT-03 |
| Funcionalidade | Cupom de desconto |
| Critério de aceite | CA03 |
| Pré-condições | Carrinho com itens. |
| Dados utilizados | `itens`: P003 × 1; `cupom`: `"XYZ"` |
| Passos | 1. Enviar `POST /api/carrinho/calcular`. 2. Verificar mensagem e desconto. |
| Resultado esperado | HTTP 200; `cupom.aplicado = false`; `cupom.mensagem = "Cupom inválido."`; `desconto = 0`. |
| Técnica | Teste negativo |

### CT-04 — Cupom expirado não aplica desconto

| Campo | Valor |
|-------|-------|
| Identificador | CT-04 |
| Funcionalidade | Cupom de desconto |
| Critério de aceite | CA04 |
| Pré-condições | Carrinho com itens. |
| Dados utilizados | `itens`: P003 × 1; `cupom`: `VERAO2026` |
| Passos | 1. Enviar `POST /api/carrinho/calcular`. 2. Verificar mensagem e desconto. |
| Resultado esperado | HTTP 200; `cupom.aplicado = false`; `cupom.mensagem = "Cupom expirado."`; `desconto = 0`. |
| Técnica | Partição de equivalência |

### CT-05 — Apenas um cupom aplicado por vez

| Campo | Valor |
|-------|-------|
| Identificador | CT-05 |
| Funcionalidade | Cupom de desconto (interface) |
| Critério de aceite | CA05 |
| Pré-condições | Carrinho com cupom já aplicado na interface. |
| Dados utilizados | Cupom aplicado: BEMVINDO10; tentativa de aplicar segundo cupom. |
| Passos | 1. Aplicar BEMVINDO10. 2. Aplicar outro cupom sem remover o anterior. |
| Resultado esperado | A interface exige remover o cupom atual antes de aplicar outro; apenas um cupom vigente por vez. |
| Técnica | Teste de interface |

### CT-06 — Frete grátis para subtotal ≥ R$ 200,00

| Campo | Valor |
|-------|-------|
| Identificador | CT-06 |
| Funcionalidade | Frete grátis |
| Critério de aceite | CA06 |
| Pré-condições | Carrinho com subtotal ≥ R$ 200,00. |
| Dados utilizados | `itens`: P003 × 2 (subtotal R$ 379,80) |
| Passos | 1. Enviar `POST /api/carrinho/calcular`. 2. Verificar frete. |
| Resultado esperado | HTTP 200; `frete = 0`; `freteGratis = true`; `valorFaltanteFreteGratis = 0`. |
| Técnica | Análise de valor limite |

### CT-07 — Frete fixo e valor faltante abaixo de R$ 200,00

| Campo | Valor |
|-------|-------|
| Identificador | CT-07 |
| Funcionalidade | Frete fixo |
| Critério de aceite | CA07 |
| Pré-condições | Carrinho com subtotal < R$ 200,00. |
| Dados utilizados | `itens`: P001 × 1 (subtotal R$ 59,90) |
| Passos | 1. Enviar `POST /api/carrinho/calcular`. 2. Verificar frete e faltante. |
| Resultado esperado | HTTP 200; `frete = 19,90`; `freteGratis = false`; `valorFaltanteFreteGratis = 140,10`. |
| Técnica | Análise de valor limite |

### CT-08 — Frete grátis considera o subtotal antes do desconto

| Campo | Valor |
|-------|-------|
| Identificador | CT-08 |
| Funcionalidade | Frete grátis |
| Critério de aceite | CA08 |
| Pré-condições | Subtotal ≥ R$ 200,00 com cupom aplicado. |
| Dados utilizados | `itens`: P003 × 2; `cupom`: BEMVINDO10 |
| Passos | 1. Enviar `POST /api/carrinho/calcular`. 2. Verificar que o frete permanece grátis. |
| Resultado esperado | HTTP 200; `desconto > 0`; `frete = 0`; `freteGratis = true`. |
| Técnica | Tabela de decisão |

### CT-09 — Desconto não incide sobre o frete

| Campo | Valor |
|-------|-------|
| Identificador | CT-09 |
| Funcionalidade | Cupom + frete |
| Critério de aceite | CA09 |
| Pré-condições | Carrinho com subtotal < R$ 200,00 e cupom aplicado. |
| Dados utilizados | `itens`: P003 × 1 (R$ 189,90); `cupom`: BEMVINDO10 |
| Passos | 1. Enviar `POST /api/carrinho/calcular`. 2. Conferir `total = subtotal - desconto + frete`. |
| Resultado esperado | HTTP 200; `desconto = 18,99`; `frete = 19,90`; `total = 190,81` (desconto não reduz o frete). |
| Técnica | Tabela de decisão |

### CT-10 — Limite de 5 unidades por produto via API 

| Campo | Valor |
|-------|-------|
| Identificador | CT-10 |
| Funcionalidade | Limite de quantidade |
| Critério de aceite | CA10 |
| Pré-condições | Nenhuma. |
| Dados utilizados | `itens`: P002 × 50, P004 × 60; `cupom`: BEMVINDO10 (e caso simples P001 × 6) |
| Passos | 1. Enviar `POST /api/carrinho/calcular` com quantidade > 5. 2. Verificar status e código de erro. |
| Resultado esperado | HTTP 422; `erro = QUANTIDADE_MAXIMA_EXCEDIDA`. |
| Técnica | Teste negativo / Análise de valor limite |
| Observação | Associado ao **BUG-001**. Resultado obtido atual diverge do esperado. |

### CT-11 — Limite de 5 unidades por produto via interface

| Campo | Valor |
|-------|-------|
| Identificador | CT-11 |
| Funcionalidade | Limite de quantidade (interface) |
| Critério de aceite | CA10 |
| Pré-condições | Produto adicionado ao carrinho na interface. |
| Dados utilizados | Incremento da quantidade de um produto até 5. |
| Passos | 1. Adicionar produto. 2. Incrementar a quantidade até 5. 3. Tentar incrementar novamente. |
| Resultado esperado | O controle de aumento é desabilitado ao atingir 5 unidades. |
| Técnica | Análise de valor limite / Teste de interface |

### CT-12 — Arredondamento em 2 casas decimais

| Campo | Valor |
|-------|-------|
| Identificador | CT-12 |
| Funcionalidade | Cálculo de valores |
| Critério de aceite | CA11 |
| Pré-condições | Carrinho com valores que geram dízimas. |
| Dados utilizados | `itens`: P003 × 1; `cupom`: BEMVINDO10 (desconto 18,99) |
| Passos | 1. Enviar `POST /api/carrinho/calcular`. 2. Verificar casas decimais. |
| Resultado esperado | HTTP 200; todos os valores com no máximo 2 casas decimais. |
| Técnica | Análise de valor limite |

### CT-13 — Pedido com cupom inválido é rejeitado

| Campo | Valor |
|-------|-------|
| Identificador | CT-13 |
| Funcionalidade | Fechamento de pedido |
| Critério de aceite | CA03 / CA04 (contexto `/api/pedidos`) |
| Pré-condições | Dados de cliente válidos. |
| Dados utilizados | `cliente` válido; `itens`: P003 × 1; `cupom`: inexistente/expirado |
| Passos | 1. Enviar `POST /api/pedidos` com cupom inválido. 2. Verificar erro. |
| Resultado esperado | HTTP 422; `erro = CUPOM_INVALIDO` (ou `CUPOM_EXPIRADO`). Diferente de `/calcular`, aqui o cupom inválido gera erro. |
| Técnica | Teste negativo |

### CT-14 — Consulta de produtos

| Campo | Valor |
|-------|-------|
| Identificador | CT-14 |
| Funcionalidade | Catálogo |
| Critério de aceite | Suporte (contexto de API) |
| Pré-condições | Nenhuma. |
| Dados utilizados | `GET /api/produtos`; `GET /api/produtos/PXXX` inexistente |
| Passos | 1. Listar produtos. 2. Consultar id inexistente. |
| Resultado esperado | Lista com 8 produtos (HTTP 200); id inexistente retorna HTTP 404 `PRODUTO_NAO_ENCONTRADO`. |
| Técnica | Partição de equivalência / Teste negativo |

---

## Cenários complementares da interface — CT-15 a CT-31

Os cenários a seguir ampliam a cobertura do fluxo de navegação, gerenciamento do carrinho e checkout. **Não constituem novos critérios de aceite da história VZS-142**; quando aplicável, são relacionados a critérios de aceite existentes ou às regras preexistentes documentadas. Todos são **planejados**, sem status de execução atribuído neste arquivo.

**Pontos a esclarecer durante a exploração:** a documentação não especifica se o indicador do carrinho representa unidades ou produtos distintos, o que ocorre ao diminuir a quantidade de 1 unidade, nem o texto exato da mensagem de carrinho vazio. Nesses casos, registrar o comportamento observado e obter confirmação do esperado antes de abrir um defeito somente por divergência de apresentação.


### CT-15 — Adicionar produto ao carrinho

| Campo | Valor |
|-------|-------|
| Identificador | CT-15 |
| Funcionalidade | Adição de itens |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Carrinho vazio; catálogo acessível. |
| Dados utilizados | P001 × 1. |
| Passos | 1. Abrir Produtos. 2. Selecionar Adicionar ao carrinho para P001. 3. Abrir Carrinho. |
| Resultado esperado | P001 é apresentado no carrinho com quantidade 1, preço unitário R$ 59,90 e subtotal R$ 59,90. |
| Técnica | Teste funcional positivo |

### CT-16 — Atualizar indicador do carrinho após adição

| Campo | Valor |
|-------|-------|
| Identificador | CT-16 |
| Funcionalidade | Indicador do carrinho |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Carrinho inicialmente vazio. |
| Dados utilizados | P001 × 2 e P004 × 1. |
| Passos | 1. Adicionar P001 e ajustar para 2 unidades. 2. Adicionar uma unidade de P004. 3. Observar indicador no cabeçalho. |
| Resultado esperado | Indicador é atualizado após as adições. Se representar unidades, deve apresentar 3; confirmar a semântica do contador antes de registrar defeito. |
| Técnica | Teste funcional / Consistência de interface |

### CT-17 — Aumentar quantidade de produto no carrinho

| Campo | Valor |
|-------|-------|
| Identificador | CT-17 |
| Funcionalidade | Edição de quantidade |
| Referência | Funcionalidade complementar; CA10 (limite máximo) |
| Pré-condições | Carrinho com P001 × 1. |
| Dados utilizados | P001: quantidade 1 → 2. |
| Passos | 1. Abrir Carrinho. 2. Clicar no controle de aumentar uma vez. 3. Observar quantidade e resumo. |
| Resultado esperado | P001 passa a 2 unidades; subtotal muda de R$ 59,90 para R$ 119,80 e o resumo é atualizado, respeitando limite de 5. |
| Técnica | Teste funcional positivo / Transição de estado |

### CT-18 — Diminuir quantidade de produto no carrinho

| Campo | Valor |
|-------|-------|
| Identificador | CT-18 |
| Funcionalidade | Edição de quantidade |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Carrinho com P001 × 3. |
| Dados utilizados | P001: quantidade 3 → 2. |
| Passos | 1. Abrir Carrinho. 2. Clicar em diminuir uma vez. 3. Conferir quantidade e resumo. |
| Resultado esperado | P001 passa a 2 unidades e subtotal a R$ 119,80; totais e indicador são atualizados. A ação de diminuir quando a quantidade é 1 deve ser observada separadamente, pois não foi especificada. |
| Técnica | Teste funcional positivo / Transição de estado |

### CT-19 — Remover um produto específico

| Campo | Valor |
|-------|-------|
| Identificador | CT-19 |
| Funcionalidade | Remoção individual |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Carrinho com P001 × 1 e P004 × 1. |
| Dados utilizados | P001 (R$ 59,90); P004 (R$ 49,90). |
| Passos | 1. Abrir Carrinho. 2. Remover somente P004. 3. Verificar conteúdo e resumo. |
| Resultado esperado | P004 desaparece, P001 permanece e subtotal passa para R$ 59,90; frete/total são recalculados e indicador é atualizado. |
| Técnica | Teste funcional / Integridade de estado |

### CT-20 — Remover todos os produtos do carrinho

| Campo | Valor |
|-------|-------|
| Identificador | CT-20 |
| Funcionalidade | Esvaziamento do carrinho |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Carrinho com P001 × 1 e P004 × 1. |
| Dados utilizados | P001 × 1; P004 × 1. |
| Passos | 1. Abrir Carrinho. 2. Acionar a funcionalidade de remover todos. 3. Conferir estado final. |
| Resultado esperado | Nenhum item permanece no carrinho e o indicador é zerado; o sistema apresenta o estado de carrinho vazio. |
| Técnica | Teste funcional / Transição de estado |

### CT-21 — Informar que o carrinho está vazio

| Campo | Valor |
|-------|-------|
| Identificador | CT-21 |
| Funcionalidade | Estado vazio |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Carrinho vazio (abrir nova aba ou esvaziar a aba atual). |
| Dados utilizados | Nenhum produto. |
| Passos | 1. Acessar Carrinho sem itens. 2. Observar mensagem e opções exibidas. |
| Resultado esperado | A página apresenta uma mensagem clara de que o carrinho está vazio; não apresenta produtos inexistentes e não permite finalizar pedido vazio. |
| Técnica | Teste de interface / Teste negativo |

### CT-22 — Atualizar indicador após remover itens

| Campo | Valor |
|-------|-------|
| Identificador | CT-22 |
| Funcionalidade | Indicador do carrinho |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Carrinho com P001 × 2 e P004 × 1. |
| Dados utilizados | Remover P004, depois P001. |
| Passos | 1. Observar indicador inicial. 2. Remover P004. 3. Conferir indicador. 4. Remover P001. 5. Conferir indicador. |
| Resultado esperado | Indicador reflete as remoções e chega a zero após esvaziamento. Se representar unidades: 3 → 2 → 0; confirmar sua semântica funcional. |
| Técnica | Teste funcional / Consistência de interface |

### CT-23 — Navegar para Produtos pelo menu

| Campo | Valor |
|-------|-------|
| Identificador | CT-23 |
| Funcionalidade | Navegação |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Aplicação aberta em Documentação ou Carrinho. |
| Dados utilizados | Item do menu Produtos. |
| Passos | 1. Clicar em Produtos no cabeçalho. 2. Observar página carregada. |
| Resultado esperado | A listagem de produtos é exibida com itens disponíveis, sem erro de navegação. |
| Técnica | Teste de navegação |

### CT-24 — Navegar para Documentação pelo menu

| Campo | Valor |
|-------|-------|
| Identificador | CT-24 |
| Funcionalidade | Navegação |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Aplicação aberta em Produtos ou Carrinho. |
| Dados utilizados | Item do menu Documentação. |
| Passos | 1. Clicar em Documentação no cabeçalho. 2. Observar página carregada. |
| Resultado esperado | A página de documentação é apresentada e seu conteúdo pode ser consultado. |
| Técnica | Teste de navegação |

### CT-25 — Navegar para Carrinho pelo menu

| Campo | Valor |
|-------|-------|
| Identificador | CT-25 |
| Funcionalidade | Navegação |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Aplicação aberta em Produtos ou Documentação. |
| Dados utilizados | Item do menu Carrinho. |
| Passos | 1. Clicar em Carrinho no cabeçalho. 2. Observar página carregada. |
| Resultado esperado | A página do carrinho é exibida com os itens da aba atual ou indicação de carrinho vazio. |
| Técnica | Teste de navegação |

### CT-26 — Abrir formulário ao clicar em Finalizar compra

| Campo | Valor |
|-------|-------|
| Identificador | CT-26 |
| Funcionalidade | Fluxo de checkout |
| Referência | Funcionalidade complementar da interface |
| Pré-condições | Carrinho com pelo menos um produto. |
| Dados utilizados | P005 × 1. |
| Passos | 1. Abrir Carrinho. 2. Clicar em Finalizar compra. 3. Conferir a próxima tela. |
| Resultado esperado | A interface direciona para a etapa de preenchimento dos dados do cliente e endereço, incluindo nome, e-mail e CEP. |
| Técnica | Teste funcional / Navegação de fluxo |

### CT-27 — Validar nome e sobrenome no checkout

| Campo | Valor |
|-------|-------|
| Identificador | CT-27 |
| Funcionalidade | Validação dos dados do cliente |
| Referência | Regra preexistente documentada (nome e sobrenome) |
| Pré-condições | Carrinho com produto; formulário de checkout aberto. |
| Dados utilizados | Nome: Maria (sem sobrenome); demais campos válidos. |
| Passos | 1. Informar apenas um nome. 2. Preencher e-mail e CEP válidos. 3. Tentar confirmar pedido. |
| Resultado esperado | Pedido não é confirmado com nome incompleto; interface sinaliza o campo inválido ou apresenta mensagem adequada. |
| Técnica | Partição de equivalência / Teste negativo |

### CT-28 — Validar formato de e-mail no checkout

| Campo | Valor |
|-------|-------|
| Identificador | CT-28 |
| Funcionalidade | Validação dos dados do cliente |
| Referência | Regra preexistente documentada (e-mail válido) |
| Pré-condições | Carrinho com produto; formulário de checkout aberto. |
| Dados utilizados | Nome: Maria Silva; e-mail: maria@; CEP: 01310-100. |
| Passos | 1. Informar nome válido. 2. Informar e-mail malformado. 3. Informar CEP válido. 4. Tentar confirmar pedido. |
| Resultado esperado | Pedido não é confirmado com e-mail inválido; interface informa a necessidade de correção. |
| Técnica | Partição de equivalência / Teste negativo |

### CT-29 — Validar CEP com e sem hífen

| Campo | Valor |
|-------|-------|
| Identificador | CT-29 |
| Funcionalidade | Validação dos dados de endereço |
| Referência | Regra preexistente documentada (CEP com 8 dígitos) |
| Pré-condições | Carrinho com produto; formulário de checkout aberto. |
| Dados utilizados | CEP válido: 01310100 e 01310-100; inválido: 0131010. |
| Passos | 1. Preencher nome e e-mail válidos. 2. Testar cada formato de CEP (em tentativas isoladas). 3. Avaliar possibilidade de confirmar. |
| Resultado esperado | Os dois formatos com oito dígitos são aceitos; CEP com sete dígitos é rejeitado. |
| Técnica | Partição de equivalência / Teste negativo e positivo |

### CT-30 — Confirmar pedido com dados válidos

| Campo | Valor |
|-------|-------|
| Identificador | CT-30 |
| Funcionalidade | Finalização de pedido |
| Referência | Fluxo de checkout; POST /api/pedidos |
| Pré-condições | Carrinho com P005 × 1; formulário aberto; nenhum cupom aplicado. |
| Dados utilizados | Maria Silva; maria@exemplo.com; CEP 01310-100; P005 × 1. |
| Passos | 1. Clicar em Finalizar compra. 2. Preencher dados válidos. 3. Confirmar pedido. 4. Inspecionar confirmação. |
| Resultado esperado | A interface confirma o pedido de teste, apresentando número no padrão VZ-000000 e valores coerentes (subtotal R$ 100,00; frete R$ 19,90; total R$ 119,90). Não há pagamento online. |
| Técnica | Teste de fluxo ponta a ponta |

### CT-31 — Recalcular valores após alterações no carrinho

| Campo | Valor |
|-------|-------|
| Identificador | CT-31 |
| Funcionalidade | Atualização do resumo financeiro |
| Referência | CA06–CA09 e CA11; funcionalidade complementar |
| Pré-condições | Carrinho com P005 × 1, sem cupom. |
| Dados utilizados | Adicionar P008 × 2; depois remover P005; sem cupom. |
| Passos | 1. Observar subtotal de P005 × 1. 2. Adicionar duas unidades de P008. 3. Conferir frete e total. 4. Remover P005. 5. Conferir novamente. |
| Resultado esperado | Inicial: subtotal R$ 100,00, frete R$ 19,90, total R$ 119,90. Após adição: subtotal R$ 200,00, frete R$ 0,00, total R$ 200,00. Após remoção: subtotal R$ 100,00, frete R$ 19,90, total R$ 119,90. |
| Técnica | Tabela de decisão / Transição de estado |

---

## Cenários em Gherkin

```gherkin

# language: pt

Funcionalidade: Cupom de desconto

  Como cliente da Verzel Store

  Quero aplicar um cupom de desconto no carrinho

  Para pagar menos nas minhas compras

  Cenário: Cupom BEMVINDO10 concede 10% de desconto (CA01)

    Dado um carrinho com 2 unidades do produto "P003"

    Quando eu calcular o carrinho com o cupom "BEMVINDO10"

    Então a resposta deve ter status 200

    E o subtotal deve ser 379.80

    E o desconto deve ser 37.98

    E o total deve ser 341.82

    E o cupom deve constar como aplicado

  Cenário: Cupom expirado não concede desconto (CA04)

    Dado um carrinho com 1 unidade do produto "P003"

    Quando eu calcular o carrinho com o cupom "VERAO2026"

    Então a resposta deve ter status 200

    E o desconto deve ser 0

    E a mensagem do cupom deve ser "Cupom expirado."

  Cenário: Cupom inexistente não concede desconto (CA03)

    Dado um carrinho com 1 unidade do produto "P003"

    Quando eu calcular o carrinho com o cupom "XYZ"

    Então a resposta deve ter status 200

    E o desconto deve ser 0

    E a mensagem do cupom deve ser "Cupom inválido."

```

```gherkin

# language: pt

Funcionalidade: Frete grátis

  Como cliente da Verzel Store

  Quero ganhar frete grátis em compras maiores

  Para economizar no valor do frete

  Cenário: Frete grátis a partir de R$ 200,00 (CA06)

    Dado um carrinho com subtotal igual ou superior a R$ 200,00

    Quando eu calcular o carrinho

    Então o frete deve ser 0

    E o carrinho deve indicar frete grátis

  Cenário: Frete fixo abaixo de R$ 200,00 (CA07)

    Dado um carrinho com 1 unidade do produto "P001"

    Quando eu calcular o carrinho

    Então o frete deve ser 19.90

    E o valor faltante para o frete grátis deve ser 140.10

  Cenário: Frete grátis considera o subtotal antes do desconto (CA08)

    Dado um carrinho com subtotal de R$ 379,80

    Quando eu calcular o carrinho com o cupom "BEMVINDO10"

    Então o desconto deve ser maior que zero

    E o frete deve permanecer 0

```

```gherkin

# language: pt

Funcionalidade: Limite de quantidade por produto

  Como loja

  Quero limitar cada produto a no máximo 5 unidades por pedido

  Para respeitar a regra de negócio CA10

  Cenário: Quantidade acima do limite é rejeitada (CA10)

    Dado um carrinho com 6 unidades do produto "P001"

    Quando eu calcular o carrinho

    Então a resposta deve ter status 422

    E o código de erro deve ser "QUANTIDADE_MAXIMA_EXCEDIDA"

```


### Gherkin — Cenários complementares da interface (CT-15 a CT-31)

Os cenários abaixo especificam o comportamento esperado para investigação e execução na interface. Onde a documentação for omissa, confirmar a convenção do produto antes de classificar diferenças como defeitos.

```gherkin
# language: pt
Funcionalidade: Gerenciamento de produtos e quantidades

  Cenário: CT-15 — Adicionar produto ao carrinho
    Dado que o carrinho está vazio
        Quando eu adicionar uma unidade de "P001" pelo catálogo
        Então o carrinho deve conter "P001" com quantidade 1
        E o subtotal deve ser 59.90


  Cenário: CT-16 — Atualizar indicador após adicionar itens
    Dado que o carrinho está vazio
        Quando eu adicionar 2 unidades de "P001" e 1 unidade de "P004"
        Então o indicador do carrinho deve refletir as adições
        E sua contagem deve seguir a convenção definida para a aplicação


  Cenário: CT-17 — Aumentar quantidade
    Dado que o carrinho contém 1 unidade de "P001"
        Quando eu aumentar a quantidade para 2
        Então o carrinho deve conter 2 unidades de "P001"
        E o subtotal deve ser 119.80


  Cenário: CT-18 — Diminuir quantidade
    Dado que o carrinho contém 3 unidades de "P001"
        Quando eu diminuir a quantidade para 2
        Então o carrinho deve conter 2 unidades de "P001"
        E o subtotal deve ser 119.80


  Cenário: CT-19 — Remover um produto sem remover os demais
    Dado que o carrinho contém "P001" e "P004"
        Quando eu remover o produto "P004"
        Então "P004" não deve mais aparecer no carrinho
        E "P001" deve permanecer
        E o subtotal deve ser 59.90


  Cenário: CT-20 — Esvaziar carrinho
    Dado que o carrinho contém "P001" e "P004"
        Quando eu acionar a opção de remover todos os produtos
        Então o carrinho não deve conter produtos
        E o indicador deve ser zerado


  Cenário: CT-21 — Exibir estado de carrinho vazio
    Dado que o carrinho está vazio
        Quando eu abrir a página do carrinho
        Então deve ser exibida uma mensagem informando que o carrinho está vazio
        E não deve ser possível confirmar um pedido sem itens


  Cenário: CT-22 — Atualizar indicador após remoções
    Dado que o carrinho contém 2 unidades de "P001" e 1 de "P004"
        Quando eu remover "P004"
        Então o indicador deve refletir a quantidade restante
        Quando eu remover "P001"
        Então o indicador deve chegar a zero


```

```gherkin
# language: pt
Funcionalidade: Navegação pelo menu

  Cenário: CT-23 — Abrir listagem de produtos
    Dado que estou em outra página da loja
        Quando eu clicar em "Produtos" no menu
        Então devo visualizar a página de listagem de produtos


  Cenário: CT-24 — Abrir documentação
    Dado que estou em outra página da loja
        Quando eu clicar em "Documentação" no menu
        Então devo visualizar a página da documentação


  Cenário: CT-25 — Abrir carrinho
    Dado que estou na página de produtos
        Quando eu clicar em "Carrinho" no menu
        Então devo visualizar a página do carrinho


```

```gherkin
# language: pt
Funcionalidade: Checkout e validação do cliente

  Cenário: CT-26 — Abrir formulário de finalização
    Dado que existe um produto no carrinho
        Quando eu clicar em "Finalizar compra"
        Então devo visualizar o formulário com nome, e-mail e CEP


  Cenário: CT-27 — Rejeitar cliente sem sobrenome
    Dado que estou no formulário de finalização com itens no carrinho
        Quando eu preencher nome com "Maria" e os demais dados corretamente
        E tentar confirmar o pedido
        Então o pedido não deve ser confirmado
        E o campo de nome deve ser indicado como inválido


  Cenário: CT-28 — Rejeitar e-mail inválido
    Dado que estou no formulário de finalização com itens no carrinho
        Quando eu preencher o e-mail com "maria@" e os demais dados corretamente
        E tentar confirmar o pedido
        Então o pedido não deve ser confirmado
        E o e-mail deve ser indicado como inválido


  Cenário: CT-29 — Aceitar CEP válido e rejeitar CEP inválido
    Dado que estou no formulário de finalização com itens no carrinho
        Quando eu informar o CEP "01310100" ou "01310-100"
        Então o formato do CEP deve ser aceito
        Quando eu informar o CEP "0131010"
        Então o formato do CEP deve ser rejeitado


  Cenário: CT-30 — Confirmar pedido válido
    Dado que o carrinho contém 1 unidade de "P005"
        Quando eu finalizar a compra com nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "01310-100"
        Então o pedido de teste deve ser confirmado
        E deve apresentar número no formato "VZ-000000"
        E o total deve ser 119.90


```

```gherkin
# language: pt
Funcionalidade: Recálculo dos valores no carrinho

  Cenário: CT-31 — Recalcular subtotal e frete ao alterar itens
    Dado que o carrinho contém 1 unidade de "P005" sem cupom
        Então o total deve ser 119.90
        Quando eu adicionar 2 unidades de "P008"
        Então o subtotal deve ser 200.00
        E o frete deve ser 0
        Quando eu remover "P005"
        Então o subtotal deve ser 100.00
        E o frete deve ser 19.90
        E o total deve ser 119.90


```


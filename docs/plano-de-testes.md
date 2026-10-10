# Plano de Testes — Verzel Store (VZS-142)

| Item | Descrição |
|---|---|
| Projeto | Verzel Store — Desafio Técnico de QA |
| História principal | VZS-142 — Cupom de desconto e frete grátis |
| Versão da aplicação documentada | 2.3.0 (30/09/2026) |
| Aplicação | https://verzel-store.qa-test-verzel-store.workers.dev/ |
| Documentação de referência | https://verzel-store.qa-test-verzel-store.workers.dev/documentacao |
| Responsável | Candidata à vaga de QA — Verzel |
| Versão do plano | 2.0 |
| Artefato de referência | `docs/cenarios-de-teste.md` — CT-01 a CT-31 |

---

## 1. Objetivo

Planejar e orientar a validação funcional da **Verzel Store**, com foco na entrega **VZS-142**, que introduz a aplicação de cupons de desconto e a regra de frete grátis, e na verificação dos fluxos da interface necessários para realizar uma compra.

Os testes buscam:

- Verificar a conformidade com os **11 critérios de aceite (CA01–CA11)** da história VZS-142.
- Validar operações de catálogo, carrinho, navegação e checkout abordadas pelos **cenários complementares CT-15 a CT-31**.
- Conferir a consistência entre os valores calculados pela API e os exibidos na interface.
- Identificar, reproduzir e registrar defeitos, associando-os a cenários, requisitos e evidências.
- Produzir documentação de execução manual e exploratória e uma suíte automatizada de regressão com Playwright.

**Delimitação:** os critérios CA01–CA11 constituem requisitos explícitos da entrega. Os testes de navegação, remoção, contador, carrinho vazio e checkout ampliam a cobertura funcional da aplicação, mas **não devem ser apresentados como novos critérios de aceite da VZS-142**. Quando o comportamento detalhado não estiver especificado, o resultado esperado deverá ser tratado como hipótese funcional sujeita à confirmação.

## 2. Base de testes e referências

- Documentação funcional da VZS-142, incluindo história, critérios de aceite, cálculos, dados de teste, endpoints e códigos de erro.
- Catálogo fixo de oito produtos (`P001` a `P008`) e dois cupons documentados (`BEMVINDO10`, válido; `VERAO2026`, expirado).
- Comportamentos observáveis na interface da loja (listagem de produtos, contador, gerenciamento do carrinho, menu e formulário de checkout).
- Matriz de cenários `docs/cenarios-de-teste.md`, com 31 cenários identificados de **CT-01 a CT-31**.

As regras de cálculo documentadas são:

```text
subtotal = soma(preço unitário × quantidade)
desconto = percentual do cupom válido × subtotal
frete = R$ 0,00 quando subtotal >= R$ 200,00; caso contrário, R$ 19,90
faltante para frete grátis = máximo(0, R$ 200,00 - subtotal)
total = subtotal - desconto + frete
```

A elegibilidade ao frete grátis considera o subtotal **antes** do desconto; o desconto não incide sobre o frete; os valores monetários devem ser arredondados a duas casas decimais.

## 3. Escopo

### 3.1 Funcionalidades em escopo

| Área | Funcionalidades e verificações |
|---|---|
| Cupom de desconto | Aplicação de 10% com `BEMVINDO10`; tolerância a maiúsculas/minúsculas e espaços nas extremidades; mensagens para cupons inexistentes e expirados; remoção e substituição do cupom aplicado. |
| Frete e valores | Frete grátis a partir de R$ 200,00 (inclusive); frete fixo abaixo do limite; valor faltante; base de cálculo antes do desconto; desconto não aplicado ao frete; subtotal, desconto, total e arredondamento. |
| Catálogo e inclusão | Consulta de produtos pela API, exibição/listagem na interface e adição de produtos ao carrinho. |
| Gerenciamento do carrinho | Incrementar e diminuir quantidades; limite de cinco unidades **por produto**; remover um item; remover todos; estado de carrinho vazio; atualização de totais. |
| Indicador do carrinho | Atualização após inclusão, aumento, diminuição e remoção de itens; confirmação da interpretação do número apresentado (unidades totais ou produtos distintos). |
| Navegação | Acesso às páginas de Produtos, Documentação e Carrinho pelos controles do menu. |
| Checkout | Acesso à finalização de compra; formulário com dados do cliente e CEP; validação de nome e sobrenome, e-mail e CEP; confirmação de pedido com dados válidos. |
| API e integração | Validação de status HTTP, corpo das respostas e erros; comparação dos valores obtidos na API com os apresentados no front-end. |

### 3.2 Endpoints em escopo

| Método | Rota | Objetivo |
|---|---|---|
| GET | `/api/produtos` | Consultar o catálogo de produtos. |
| GET | `/api/produtos/{id}` | Consultar um produto por ID e tratar ID inexistente. |
| POST | `/api/carrinho/calcular` | Verificar regras de cupom, quantidade, frete e cálculo do carrinho. |
| POST | `/api/pedidos` | Validar dados do cliente, regras de negócio e confirmação do pedido. |

No cálculo do carrinho, cupons inválidos ou expirados retornam **HTTP 200**, sem desconto e com mensagem explicativa. Na confirmação do pedido, esses cupons são rejeitados com **HTTP 422**. Essas diferenças fazem parte do comportamento esperado.

### 3.3 Fora de escopo

- Login, autenticação e cadastro de clientes.
- Pagamento online, cobrança e processamento financeiro real; a modalidade descrita é pagamento na entrega.
- Consulta, armazenamento ou histórico de pedidos (não implementados neste ambiente).
- Estoque real, reserva de mercadorias e controle de disponibilidade.
- Manutenção administrativa de catálogo, preços e cupons.
- Envio real de e-mails e integração logística real.
- Ensaios aprofundados de carga, estresse, segurança e acessibilidade; matriz exaustiva de navegadores/dispositivos.

## 4. Matriz de cobertura e rastreabilidade

| Grupo | Cenários | Requisito / origem | Camada principal |
|---|---|---|---|
| Cupons e normalização | CT-01 a CT-05 | CA01–CA05 | API e interface |
| Frete e composição do total | CT-06 a CT-09 | CA06–CA09 | API |
| Limite de quantidade | CT-10 e CT-11 | CA10 | API e interface |
| Precisão monetária | CT-12 | CA11 | API |
| Rejeição de cupom no pedido | CT-13 | Regras de `/api/pedidos`, relacionadas a CA03 e CA04 | API |
| Consulta de catálogo | CT-14 | Contrato de `/api/produtos` | API |
| Inclusão e contador | CT-15 e CT-16 | Fluxo funcional complementar | Interface |
| Alteração de quantidades | CT-17 e CT-18 | Carrinho; relação com CA10 | Interface |
| Remoção e carrinho vazio | CT-19 a CT-22 | Fluxo funcional complementar | Interface |
| Navegação do menu | CT-23 a CT-25 | Fluxo funcional complementar | Interface |
| Acesso ao checkout | CT-26 | Fluxo funcional complementar | Interface |
| Validação de dados do cliente | CT-27 a CT-29 | Regras adicionais de pedido/cliente | Interface e API |
| Confirmação do pedido | CT-30 | Contrato de `/api/pedidos` | Interface e API |
| Recálculo após alterações | CT-31 | Integração das regras de cálculo e carrinho | Interface e API |

A matriz documenta **31 cenários planejados**, sem pressupor que todos foram executados. Casos desdobrados em mais de uma massa de teste devem ter suas execuções individualizadas no registro de resultados.

## 5. Estratégia de testes

### 5.1 Preparação e análise documental

1. Revisar os critérios CA01–CA11, as regras adicionais e os contratos da API.
2. Confirmar valores esperados antes da execução, usando os preços e cupons documentados.
3. Identificar ambiguidades e comportamentos complementares observáveis na interface.
4. Relacionar cada cenário à regra ou funcionalidade correspondente.

### 5.2 Testes manuais de API

- Executar as requisições no **Postman** com `Content-Type: application/json` para requisições com corpo.
- Conferir status HTTP, estrutura JSON, códigos e mensagens de erro, quantidades, valores monetários e dados normalizados.
- Testar entradas positivas, negativas, valores-limite e combinações de regras.
- Validar especialmente a diferença de tratamento de cupons inválidos entre `/api/carrinho/calcular` e `/api/pedidos`.
- Registrar request, response, status HTTP e evidência de cada execução relevante.

### 5.3 Testes manuais de interface

- Percorrer o menu e verificar a navegação para Produtos, Documentação e Carrinho.
- Adicionar produtos e acompanhar o indicador do carrinho.
- Aumentar/diminuir quantidades, respeitar o limite de cinco por produto e conferir a atualização dos totais.
- Remover um produto individualmente, esvaziar o carrinho e validar a mensagem de estado vazio.
- Aplicar, remover e substituir cupom pela interface.
- Verificar a apresentação do frete, do valor faltante para frete grátis e do total após mudanças no carrinho.
- Acessar o checkout, validar dados do cliente e concluir pedido válido, observando a resposta exibida.

**Isolamento:** como o carrinho fica armazenado apenas na aba do navegador, iniciar os testes de interface a partir de um estado controlado e restabelecer as pré-condições entre os cenários.

### 5.4 Testes de integração e consistência

Comparar as informações exibidas pela interface com as retornadas pela API para a mesma composição de itens e cupom: quantidade, subtotal, desconto, frete, valor faltante e total. Observar o recálculo após inclusão, alteração ou remoção de itens e após aplicação/remoção de cupom.

### 5.5 Testes exploratórios

Executar sessões exploratórias curtas orientadas a riscos, com registro dos passos e descobertas, incluindo:

- Transições para carrinho vazio após remoção individual e remoção de todos.
- Alterações que cruzem o limite de R$ 200,00 para frete grátis.
- Alterações de quantidade quando um cupom está aplicado.
- Tentativas de atingir a sexta unidade do mesmo produto.
- Acesso ao checkout com formulário incompleto ou dados inválidos.
- Navegação entre páginas com carrinho já preenchido, dentro da mesma aba.

Comportamentos descritos pela documentação como simplificações intencionais **não serão registrados como bugs**.

### 5.6 Automação de regressão

Implementar e disponibilizar **pelo menos três testes automatizados com Playwright**, priorizando risco e valor de negócio. A seleção inicial recomendada é:

1. Aplicação do cupom `BEMVINDO10` e verificação do desconto de 10%.
2. Frete grátis no limite exato de R$ 200,00.
3. Rejeição de quantidade maior que cinco unidades por produto, com expectativa de HTTP 422.

Podem ser acrescentados testes end-to-end de navegação, manutenção do carrinho e checkout conforme o tempo disponível. Os testes devem conservar os resultados esperados da especificação, **sem adaptar as asserções para fazer um defeito passar**. Falhas conhecidas devem ser evidenciadas e referenciadas nos relatórios.

## 6. Tipos e técnicas de teste

### 6.1 Tipos

| Tipo | Aplicação |
|---|---|
| Funcional | Verificação das regras CA01–CA11 e dos fluxos complementares do carrinho e checkout. |
| API / contrato | Validação dos endpoints, estruturas de resposta, status e códigos de erro. |
| Interface (UI) | Exibição de mensagens, navegação, contador, controles de quantidade e remoção. |
| Integração | Coerência dos valores entre a API e o carrinho apresentado ao cliente. |
| Exploratório | Investigação de transições e combinações não cobertas diretamente nos passos roteirizados. |
| Regressão automatizada | Reexecução de cenários críticos via Playwright. |

### 6.2 Técnicas

| Técnica | Exemplos planejados |
|---|---|
| Particionamento de equivalência | Cupom válido/inexistente/expirado; nome/e-mail/CEP válidos e inválidos; quantidades permitidas/proibidas. |
| Análise de valor-limite | Quantidade 1, 5 e 6; subtotal imediatamente abaixo de R$ 200,00, exatamente R$ 200,00 e acima. |
| Tabela de decisão | Cupom aplicado/não aplicado × subtotal abaixo/no limite/acima do frete grátis. |
| Transição de estados | Carrinho vazio → preenchido → alterado → parcialmente removido → vazio; cupom aplicado → removido. |
| Teste negativo | Exceder limite de quantidade, cupom inválido, campos incorretos, produto inexistente. |
| Teste baseado em fluxo | Catálogo → carrinho → checkout → confirmação. |

**Dados úteis para fronteiras:** `P005 × 2 = R$ 200,00`; `P001 + P002 = R$ 199,80`; `P007 × 1 = R$ 229,90`. Como o catálogo é fixo, não se pressupõe a possibilidade de formar qualquer subtotal arbitrário (por exemplo, exatamente R$ 199,99).

## 7. Ambiente, ferramentas e massa de dados

| Recurso | Detalhe |
|---|---|
| Ambiente | Verzel Store — ambiente compartilhado de teste da seleção. |
| Front-end | Aplicação web acessível pela URL oficial. |
| API | Rotas REST sob `/api`, com JSON. |
| Navegador | Navegador baseado em Chromium; registrar versão utilizada na execução. |
| Testes manuais de API | Postman. |
| Automação | Node.js, TypeScript e `@playwright/test`. |
| Documentação e evidências | Arquivos Markdown, capturas de tela e respostas das requisições. |
| Versionamento | Git / GitHub. |
| Massa de teste | Produtos P001–P008; cupons BEMVINDO10 e VERAO2026; dados fictícios de cliente. |

Nenhum pedido realizado nesse ambiente corresponde a uma compra real. Não é necessário utilizar dados pessoais verdadeiros nos testes.

## 8. Critérios de entrada, execução e encerramento

### 8.1 Entrada

- Documentação e critérios de aceite disponíveis.
- Aplicação e endpoints acessíveis.
- Massa de dados conhecida e resultados esperados definidos.
- Postman e, para automação, dependências do Playwright configurados.
- Matriz de cenários identificada e versionada.

### 8.2 Registro da execução

Cada execução deve registrar ao menos: ID do cenário, data, ambiente, dados utilizados, resultado esperado, resultado obtido, status e evidência. Os status utilizados serão:

- **Aprovado:** resultado obtido conforme o esperado.
- **Reprovado:** divergência confirmada entre esperado e obtido.
- **Bloqueado:** execução inviabilizada por dependência, indisponibilidade ou problema de ambiente.
- **Não executado:** cenário planejado ainda não executado.

Um cenário não executado **não** deve ser descrito como validado. Resultados parciais ou diferentes massas executadas devem ser individualizados em observações ou registros separados.

### 8.3 Critérios de encerramento

A execução poderá ser consolidada no relatório final quando:

- Todos os cenários da matriz tiverem um **status atualizado e justificável**.
- Os cenários efetivamente executados tiverem resultado obtido e evidências referenciadas.
- As falhas confirmadas tiverem relato reproduzível e rastreabilidade ao cenário e requisito.
- A suíte Playwright prevista estiver implementada, com comandos de execução documentados e resultado real da execução registrado.
- O relatório final indicar cobertura alcançada, cenários não executados ou bloqueados, defeitos pendentes e riscos residuais.

**Meta de cobertura:** buscar a execução de todos os 31 cenários planejados. A existência de cenários bloqueados ou não executados não deve ser mascarada como cumprimento integral; suas razões e impactos serão explicitados no encerramento.

## 9. Gestão de defeitos e evidências

Um defeito deverá conter: identificador, título, requisito/cenário relacionado, ambiente, pré-condições, passos para reprodução, entrada utilizada, resultado esperado, resultado obtido, severidade sugerida e evidências. A severidade será avaliada considerando o impacto no fluxo de compra e nas regras de negócio, e poderá ser revista com evidências adicionais.

As evidências podem incluir capturas de tela, requisições e respostas JSON, registros do Postman e relatórios Playwright. Arquivos devem ser nomeados e referenciados pelo ID do cenário ou do bug, preservando a rastreabilidade.

### 9.1 Defeito já identificado

**BUG-001 — Limite de quantidade excedido no cálculo do carrinho:** em teste realizado com `P002 × 50` e `P004 × 60`, a rota `POST /api/carrinho/calcular` retornou HTTP 200 e calculou o pedido, em vez de retornar HTTP 422 com `QUANTIDADE_MAXIMA_EXCEDIDA`, em desacordo com CA10. Esse resultado é confirmado **apenas para o endpoint e os dados efetivamente testados**. O comportamento de `/api/pedidos` e da interface deve ser avaliado separadamente, sem extrapolar a conclusão.

## 10. Riscos, limitações e pontos de atenção

| Risco / limitação | Possível impacto | Mitigação |
|---|---|---|
| Instabilidade do ambiente compartilhado | Testes bloqueados, falhas transitórias. | Registrar data/hora, repetir de modo controlado e diferenciar falha de ambiente de defeito funcional. |
| Catálogo e cupons fixos | Restrição das massas de teste e dos subtotais alcançáveis. | Usar combinações reais do catálogo e documentar limites da cobertura. |
| Estado do carrinho restrito à aba | Execuções influenciadas pelo estado deixado por outro cenário na mesma aba. | Estabelecer pré-condições e reinicializar o carrinho entre casos quando necessário. |
| Pedidos fictícios não armazenados | Impossibilidade de validar histórico ou consulta pós-compra. | Validar apenas a confirmação e a resposta do endpoint. |
| Comportamento do contador não detalhado formalmente | Risco de classificar como bug uma interpretação não especificada. | Confirmar por exploração se o contador representa unidades ou produtos distintos antes de estabelecer asserção rígida. |
| Comportamento do controle de diminuir no limite mínimo não detalhado | Ambiguidade entre bloquear decremento e remover item. | Documentar o comportamento observado e pedir esclarecimento se houver conflito com a expectativa. |
| Defeito conhecido no limite de quantidade (BUG-001) | Rejeição não ocorre em cenário de API já testado. | Manter expectativa documentada, associar evidência e verificar separadamente as demais camadas. |
| Prazo limitado do desafio | Cobertura manual/automatizada possivelmente incompleta. | Priorizar requisitos críticos, divulgar cobertura real e registrar pendências no relatório final. |

## 11. Entregáveis e organização

| Entregável | Local sugerido |
|---|---|
| Plano de testes | `docs/plano-de-testes.md` |
| Matriz CT-01 a CT-31 e Gherkin | `docs/cenarios-de-teste.md` |
| Execução manual e exploratória | `docs/execucao-dos-testes.md` |
| Relatório final de qualidade | `docs/relatorio-final.md` |
| Defeitos | `bugs/` |
| Evidências (API e interface) | `evidencias/` |
| Coleção Postman exportada, se disponível | `postman/` |
| Testes Playwright e configuração | `tests/`, `playwright.config.ts`, `package.json` |
| Instruções gerais | `README.md` |

## 12. Observações finais

Este plano representa a **estratégia prevista**, não uma declaração de aprovação de todos os testes. A situação real da aplicação será apresentada nos registros de execução e no relatório final. Mudanças relevantes na documentação, no escopo ou nos cenários deverão ser refletidas em nova versão deste plano.

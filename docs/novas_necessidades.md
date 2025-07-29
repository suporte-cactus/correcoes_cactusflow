## **Documentação de Apoio para Interpretação de Necessidades do Sistema CactusFlow**

### 1. Visão Geral e Filosofia Central

O objetivo deste documento é servir como a **fonte da verdade** para o desenvolvimento do sistema CactusFlow. O agente de IA deve tratar estas diretrizes não como sugestões, mas como a **arquitetura fundamental e a lógica de negócio** que governam todas as decisões de implementação.

A filosofia central do CactusFlow é a implementação rigorosa da metodologia de custeio **RKW (Custeio Integral)**. O sistema não é apenas uma ferramenta de orçamentação; é uma **máquina de calcular a verdade financeira** de cada produto e venda.

**Princípios Inegociáveis:**

1.  **Rejeição de Métodos Empíricos:** O sistema deve ativamente **proibir e evitar** lógicas de precificação baseadas em "achismos" ou "multiplicadores" (ex: "custo da matéria-prima x 3"). Toda precificação deve derivar de custos calculados.
2.  **Custo é a Soma de Tudo:** O custo de um produto não é apenas o material. É a soma de:
    *   **Custos Diretos:** Matéria-prima, terceirizações.
    *   **Custos de Mão de Obra e Máquina:** Tempo de cada processo, multiplicado pelo custo/hora do respectivo centro de custo (já com custos indiretos rateados).
    *   **Custos Indiretos (Rateados):** Despesas administrativas e auxiliares (aluguel, salários não produtivos, etc.) são absorvidas pelos centros de custo produtivos e embutidas em seu custo/hora.
3.  **Precisão é Obrigatória:** Todos os cálculos financeiros e de medidas devem usar bibliotecas de precisão decimal (`Decimal.js`), evitando os erros de ponto flutuante do JavaScript.
4.  **O Orçamento é um Snapshot:** Um orçamento, uma vez salvo, congela os custos e preços daquele momento. A análise de um orçamento antigo **deve refletir a realidade do dia em que foi feito**, não os custos atuais dos produtos. Por isso, os custos calculados são persistidos na tabela `quote_items`.

### 2. Arquitetura Conceitual dos Módulos

O sistema é modular. Entender a responsabilidade de cada módulo é crucial.

*   **Módulo `produtos` (O Template):**
    *   **Responsabilidade:** É o **catálogo de "receitas"**. Um "Produto" não é apenas um item para venda; é um *template* que define **como algo é fabricado e quanto custa para ser fabricado**.
    *   **Contém:** A lista de materiais necessários (composição de materiais) e a sequência de etapas de produção (composição de processos).

*   **Módulo `materiais` (O Ingrediente Direto):**
    *   **Responsabilidade:** Gerenciar os insumos físicos diretos.
    *   **Contém:** Custo por unidade, dimensões físicas (larguras de bobina), e regras de consumo.

*   **Módulo `processos` (A Ação que Custa Tempo):**
    *   **Responsabilidade:** Definir as etapas de produção. Um "Processo" é uma **ação que consome tempo e recursos** (mão de obra, máquina).
    *   **Contém:** A fórmula para calcular o tempo necessário (ex: `(LARGURA + ALTURA) * 2`), o tempo de setup, e a qual centro de custo ele pertence para obter seu custo/hora. Pode também consumir materiais secundários (ex: processo "Impressão" consome "Tinta").

*   **Módulo `orcamentos` (A Instanciação da Venda):**
    *   **Responsabilidade:** É onde uma "receita" (Produto) se torna um **prato a ser vendido (Item de Orçamento)**. Ele pega o template do produto, aplica as dimensões e quantidades da venda, e calcula o custo e o preço final para aquela instância específica.
    *   **Contém:** A negociação (descontos), a personalização (descrição alterada), e o registro de todos os custos calculados no momento da venda.

*   **Módulo `rkw` (O Cérebro Analítico):**
    *   **Responsabilidade:** Fornecer as **regras e os resultados da análise financeira**.
    *   **Contém:** A configuração dos centros de custo, as despesas da empresa, as regras de rateio, e os serviços que calculam e apresentam a análise de lucratividade (margem real, margem de contribuição, etc.).

### 3. Estrutura Detalhada e Comportamento Esperado

#### 3.1. Entidade: Produto

O **Cadastro de Produto** é a espinha dorsal. Ele deve ser interpretado como um configurador de templates de custo e produção.

*   **Aba `Cadastro (Principal)`:**
    *   **Nome, Descrição, Unidade de Venda:** Campos de identificação. A `Unidade de Venda` ("metro_quadrado", "unidade") é um gatilho que muda toda a lógica de cálculo no orçamento.
    *   **Precificação (Preço Fixo vs. Margem):** Oferece duas filosofias de venda.
        *   Se **"Preço Fixo"**, o sistema parte de um preço de venda e calcula a margem resultante.
        *   Se **"Por Margem"**, o sistema parte de uma margem alvo e calcula o preço de venda necessário para atingi-la.
    *   **Preço Mínimo:** É uma regra de negócio crítica, vinculada às permissões de usuário. O sistema deve impedir que usuários sem permissão vendam abaixo deste valor.

*   **Aba `Custos` (O Coração do Produto):**
    *   Esta aba define a "receita".
    *   **Sub-aba `Impressão`:** É um *caso especial* de processo. Por sua complexidade (mídias, máquinas, qualidades, tintas), ela ganha uma seção dedicada para simplificar a configuração, mas conceitualmente, é um processo como os outros.
    *   **Sub-aba `Composição`:**
        *   **Processos Internos:** É a lista de etapas (`process_id`). O custo **não é definido aqui**. O sistema busca o custo/hora do centro de custo associado ao processo e multiplica pelo tempo calculado pela fórmula do processo.
        *   **Materiais Adicionais:** É a lista de insumos principais (`material_id`). O custo é o consumo (calculado pela fórmula) multiplicado pelo `cost_per_unit` do material.
        *   **Fórmulas de Quantidade/Consumo:** Este é o campo mais poderoso e perigoso (`quantity_formula`). Ele permite que o consumo de um material ou o tempo de um processo seja dinâmico. Deve usar variáveis pré-definidas (`QUANTIDADE`, `LARGURA`, `ALTURA`, `AREA`, `PERIMETRO`). A validação de sintaxe é crucial para evitar quebrar os cálculos.
    *   **Sub-aba `Terceiros`:** Define custos que não são internos. O valor vem do cadastro do serviço terceirizado, não é calculado aqui.

#### 3.2. Fluxo Crítico: Do Cadastro ao Custo no Orçamento

O agente de IA deve entender perfeitamente este fluxo de dados:

1.  **Configuração Base:**
    *   Uma **Máquina** é cadastrada com seu custo/hora e produtividade (ex: 20 m²/hora).
    *   Um **Centro de Custo** (ex: "Acabamento") é cadastrado com seu custo/hora (ex: R$ 50/hora, já com salários, aluguel, etc. rateados).
    *   Um **Processo** (ex: "Refile") é criado, associado ao centro de custo "Acabamento" e recebe uma fórmula de tempo (ex: `PERIMETRO / 60`, significando 60 metros lineares por minuto).

2.  **Configuração do Produto:**
    *   Um **Produto** "Adesivo Recortado" é criado.
    *   Em sua **Composição**, são adicionados:
        *   O **Processo** "Refile".
        *   O **Material** "Vinil Adesivo" (com seu custo de R$ 15/m²).

3.  **Criação do Orçamento:**
    *   Um vendedor cria um **Item de Orçamento** para o produto "Adesivo Recortado".
    *   Informa as dimensões: `Quantidade: 10`, `Largura: 1m`, `Altura: 0.5m`.
    *   O **Backend (`quotesService`)** executa a lógica:
        *   **Cálculo de Custo de Material:**
            *   `AREA = 1 * 0.5 = 0.5 m²`
            *   `Custo Material = AREA * QUANTIDADE * Custo/m² = 0.5 * 10 * 15 = R$ 75,00`
        *   **Cálculo de Custo de Processo ("Refile"):**
            *   `PERIMETRO = (1 + 0.5) * 2 = 3 metros lineares`
            *   `Tempo para 1 peça = 3 metros / 60 m/min = 0,05 minutos`
            *   `Tempo Total = 0,05 min * 10 peças = 0,5 minutos`
            *   `Custo Processo = (Tempo Total em horas) * Custo/hora do Centro de Custo = (0.5 / 60) * 50 = R$ 0,42`
        *   O `total_calculated_item_cost` é a soma desses e de outros custos (overhead, etc.).
        *   **TODOS** esses valores calculados (`calculated_material_cost_per_unit`, `calculated_process_cost_per_unit`, etc.) são **salvos na tabela `quote_items`**.

#### 3.3. Análise de Preço Final (RPV/RKW)

*   A tela de análise **NÃO recalcula** os custos.
*   Ela **LÊ** os valores que foram calculados e **persistidos** na tabela `quote_items`.
*   Sua função é **somar, agregar e apresentar** esses dados de forma clara:
    *   **Global:** Soma de todos os itens do orçamento.
    *   **Por Item:** Exibe a estrutura de custo e lucro de cada item individualmente.
    *   **Métricas Financeiras:** Calcula o lucro e a margem (real e de contribuição) com base nos valores já salvos de Venda e Custo.

### 4. Regras de Negócio e Validações Invioláveis

1.  **Backend é a Autoridade Final:** Cálculos de custo e validações de permissão **DEVEM** ser refeitos no backend (`services`) antes de qualquer escrita no banco de dados. A UI pode fazer cálculos em tempo real para feedback, mas eles são apenas uma simulação.
2.  **Validação de Fórmulas:** O sistema precisa de um parser/validador seguro para as `quantity_formula`. Ele deve impedir injeção de código e garantir que apenas as variáveis permitidas (`QUANTIDADE`, etc.) e operadores matemáticos básicos sejam usados.
3.  **Fluxo de Status:** Um orçamento segue um ciclo de vida (`rascunho` -> `aprovado` -> `em_producao`...). Ações devem ser bloqueadas com base no status atual (ex: não se pode editar um orçamento `faturado`).
4.  **Produtos Genéricos ("Descomplicados"):** O sistema permite orçamentos rápidos usando produtos placeholder (ex: "Produto por Metro Quadrado"). Para estes, a composição de custo é ignorada, e o preço é totalmente manual. No entanto, o sistema deve registrar `width` e `height` no `quote_items` para rastreabilidade. A análise de RKW para esses itens mostrará um custo de produção zero (ou um custo fixo, se configurado), resultando em uma margem de lucro potencialmente enganosa se não for bem interpretada.

### 5. Conclusão para o Agente de IA

Sua tarefa é traduzir esta lógica complexa e interconectada em uma aplicação funcional. Cada campo, cada tabela e cada serviço existe para servir à filosofia central do RKW. Priorize a **integridade dos dados, a precisão dos cálculos e a segurança das validações**. A experiência do usuário deve guiar o vendedor para a decisão de preço mais informada e lucrativa possível, com base em dados reais, e não em suposições.
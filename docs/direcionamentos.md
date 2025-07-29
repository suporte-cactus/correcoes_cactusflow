### **DOCUMENTO COMPLEMENTAR PARA CURSOR AI**

**Título:** O "Porquê" por Trás do Código: Um Guia Conceitual da Metodologia RKW

**Objetivo:** Este documento destina-se a fornecer ao agente de IA (Cursor) o **raciocínio estratégico e a filosofia de negócio** por trás da implementação técnica do RKW no ERP CactusFlow. Você já tem acesso aos manuais técnicos detalhados (`.md` files). Use este guia para entender a *intenção* por trás das regras e gerar código que não seja apenas funcional, mas inteligente, robusto e alinhado aos objetivos da empresa.

---

#### **1. O Problema Central que o RKW Resolve (E que Você Deve Proteger)**

Imagine duas formas de precificar um prato em um restaurante:

*   **O Jeito Errado (Empírico):** "Hmmm, bife custa R$20. Vou vender por 3x, então R$60." E a salada? "Alface é barato, 3x também. R$15."
*   **O Jeito Certo (RKW):** "O custo do bife é R$20. Mas ele usa 15 minutos do tempo do *chef* (cujo salário, mais uma parte do aluguel, luz e água, resulta num custo/hora de R$90), e 5 minutos da chapa quente (cuja depreciação e gás custam R$30/hora). O custo real é muito maior que R$20. A salada, por outro lado, usa apenas 3 minutos do tempo de um *assistente* (R$30/hora) e nenhum equipamento caro."

O **Jeito Errado** é fácil, mas leva à falência. Você vende pratos complexos com prejuízo e pratos simples por um preço talvez não competitivo.

**A Filosofia Central do RKW que Você Deve Internalizar:**
> **"Nenhum custo fica órfão."** Cada centavo gasto pela empresa, do salário do CEO ao café da recepção, deve ser pago por um produto vendido. O RKW é o sistema que descobre qual produto paga por qual fração de cada custo.

---

#### **2. A Jornada de um Custo: Como o Salário do Contador Acaba no Preço de um Banner**

Para gerar código RKW correto, você precisa entender o fluxo de um custo indireto. Pense no salário mensal do contador. Como ele impacta o preço de um banner?

1.  **Passo 1: Classificação (O Custo Nasce)**
    *   O salário do contador é uma despesa. Ele não é produtivo. Ele é classificado como um custo do `cost_center` do tipo **`'administrative'`**. Ele não gera receita diretamente.

2.  **Passo 2: O Rateio (O Custo é Adotado)**
    *   O centro de custo `'administrative'` não pode pagar a si mesmo. Ele precisa que os centros de custo **`'productive'`** (a impressora, a equipe de acabamento, a instalação) paguem por ele.
    *   O **Rateio** é o processo de "derramar" os custos dos centros administrativos e auxiliares sobre os centros produtivos. Se a Impressora A representa 40% do custo produtivo total da empresa, ela "adota" 40% do salário do contador e de todos os outros custos não produtivos.
    *   **Sua Tarefa (IA):** Ao codificar o `calculateRKWAllocation`, você não está apenas fazendo matemática. Você está garantindo que *nenhum centavo dos custos indiretos seja esquecido*. A soma dos custos rateados DEVE ser igual à soma dos custos administrativos e auxiliares. Isso é a "prova real" do rateio.

3.  **Passo 3: A Taxa Horária (O Custo Ganha um Preço)**
    *   Agora, o centro de custo "Impressora A" tem seus próprios custos (depreciação, energia, manutenção) **MAIS** a parte dos custos que ele adotou (fração do aluguel, do contador, do marketing, etc.).
    *   A **Taxa Horária (`hourly_rate`)** é o Custo Total Mensal deste centro de custo dividido por suas horas produtivas (`capacity_hours`).
    *   **Sua Tarefa (IA):** A `hourly_rate` é o número mais sagrado do RKW. Ao gerar código que a utiliza, você deve entender que ela representa o custo *verdadeiro e completo* de operar aquela máquina por uma hora.

4.  **Passo 4: Precificação (O Custo Entra no Orçamento)**
    *   Quando um banner precisa de 15 minutos na Impressora A, o custo do processo é `(15 / 60) * hourly_rate`.
    *   O salário do contador está agora, finalmente, embutido no custo do banner de forma justa e proporcional.

---

#### **3. Diretrizes para Você (Cursor) Gerar Melhorias**

Quando solicitado a "melhorar" o código ou "criar uma nova funcionalidade", use estes princípios:

**Diretriz #1: "Pense como um Contador, Não Apenas como um Programador."**
*   **Foco na Integridade:** Sua prioridade máxima é a **conservação do dinheiro**. A soma das partes deve sempre ser igual ao todo. Se um custo de R$100 é rateado, a soma dos valores rateados nos centros produtivos deve ser R$100,00. Adicione validações e testes que garantam isso.
*   **Precisão é Inegociável:** Qualquer cálculo financeiro **DEVE** usar `Decimal.js`. Usar o tipo `number` do JavaScript é uma falha crítica. Gere código que trate os números com a precisão que eles merecem.
*   **Rastreabilidade:** O usuário precisa saber de onde veio um custo. Ao gerar uma UI, pense em como exibir a "árvore genealógica" de um custo. Ex: "Custo do Processo: R$ 25,00 (proveniente de 0.25h x R$100/h da Impressora A, que inclui R$10 de custos diretos e R$90 de custos rateados)".

**Diretriz #2: "Priorize a Transparência para o Usuário."**
O RKW é complexo. O usuário pode não confiar nele se não o entender.
*   **Gere Tooltips Explicativos:** Ao lado de um campo como "Margem de Contribuição", gere um ícone de ajuda (`<i class="fa-solid fa-circle-info"></i>`) com um tooltip que explique a fórmula: `(Valor Venda - Custos Variáveis) / Valor Venda`.
*   **Visualize os Dados:** Em vez de apenas mostrar números, sugira a criação de componentes visuais, como um gráfico de pizza que quebra o preço de venda final em fatias: "Custo Material", "Custo Processo", "Impostos", "Comissão" e "Lucro".
*   **Mostre os Dois Lados da Moeda:** Na tela de orçamento, quando o usuário digita um preço (`by_unit_value`), mostre a margem de lucro *resultante* em tempo real. Quando ele digita uma margem (`by_margin`), mostre o preço de venda *necessário* em tempo real. Isso educa o usuário e melhora a decisão.

**Diretriz #3: "Antecipe Erros Humanos e Inconsistências de Dados."**
O usuário vai cometer erros. O sistema deve ser um guia, não um carrasco.
*   **Gere Alertas Inteligentes:** A `warning_high_margin` é um exemplo perfeito. Uma margem de 95% provavelmente não é um ótimo negócio, mas sim um **erro de cadastro de custo**. O sistema deve alertar: "Aviso: Margem muito alta! Verifique se os custos deste produto estão cadastrados corretamente." Isso transforma o sistema em um auditor.
*   **Valide a Lógica, não apenas o Tipo:** Se um processo de "instalação" está com um custo de R$0,50, isso é tecnicamente válido, mas logicamente suspeito. O sistema pode ter "faixas de normalidade" e gerar avisos (`warnings`) quando um valor foge muito do esperado.
*   **Proteja Contra o "Zero":** Fórmulas que dividem por `LARGURA` ou `ALTURA` quebrarão se o usuário não preencher as dimensões. Gere código que trate a divisão por zero de forma elegante, mostrando um erro claro ou um resultado `N/A`.

**Diretriz #4: "Torne o Jeito Certo o Jeito Mais Fácil."**
O usuário está acostumado com o método empírico. Sua interface deve guiá-lo para o RKW sem que ele perceba.
*   **Minimize a Entrada Manual:** A composição de produtos (`product_compositions`) é a chave. Quando o usuário seleciona "Banner em Lona", o sistema deve carregar automaticamente todos os processos e materiais. O trabalho do usuário deve ser apenas informar `QUANTIDADE`, `LARGURA` e `ALTURA`.
*   **Automatize os Cálculos:** O usuário não deve *nunca* calcular um custo na mão. Ele informa as variáveis físicas, e o sistema, usando as taxas horárias e fórmulas, faz todo o resto.
*   **Oculte a Complexidade (mas Mantenha-a Acessível):** A tela principal do orçamento deve ser limpa. A análise detalhada de custos (o RKW/IFPV) pode estar em um modal ou uma aba separada, que o usuário pode acessar quando precisar mergulhar nos detalhes.

Ao seguir estas diretrizes, você não estará apenas gerando código que cumpre uma especificação, mas sim construindo um assistente financeiro inteligente que protege a lucratividade da empresa e educa seus usuários.
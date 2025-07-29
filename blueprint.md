Compreendido. Com base em toda a análise, no protótipo de alta fidelidade e na arquitetura TSX proposta, elaborei o `blueprint.md`.

Este documento é uma especificação técnica detalhada, projetada para ser a "fonte da verdade" para um desenvolvedor utilizando o VS Code. Ele traduz a visão do produto e a lógica de negócio RKW em um plano de implementação de software claro e acionável.

-----

### `blueprint.md`

```markdown
# Blueprint de Implementação: Módulo de Cadastro de Produtos (CactusFlow)
**Versão:** 1.0
**Data:** 29 de Julho de 2025
**Autor:** Gemini (Engenheiro de UI/UX AI)

## 1. Visão Geral e Filosofia

Este documento detalha a arquitetura e a implementação do módulo de **Cadastro de Produtos** para o ERP CactusFlow. O objetivo é criar uma interface de alta fidelidade que não apenas capture os dados, mas que também incorpore e guie o usuário através da filosofia de custeio RKW.

[cite_start]O Cadastro de Produto é a entidade central do sistema, o "maestro" [cite: 9] que orquestra como um item é fabricado (custos) e como ele é vendido (preço). [cite_start]O princípio fundamental é que "nenhum custo fica órfão"[cite: 253]; cada configuração nesta tela garante que todos os aspectos da produção sejam meticulosamente contabilizados no custo final do produto. [cite_start]A implementação deve refletir essa precisão e ser a ferramenta que transforma "o jeito certo no jeito mais fácil" [cite: 295] de precificar.

## 2. Arquitetura Técnica Proposta

A implementação será baseada em uma stack moderna para garantir manutenibilidade, escalabilidade e uma excelente experiência de desenvolvimento (DX).

* **Framework/Biblioteca:** React com TypeScript (TSX)
* **Gerenciamento de Estado:** React Context API combinado com `useReducer` para o estado complexo do formulário.
* **Estilização:** CSS Modules para estilos escopados por componente, com variáveis globais de CSS para o tema.
* **Drag and Drop:** `dnd-kit` para reordenação de listas.

### 2.1. Estrutura de Arquivos

A organização dos arquivos seguirá uma abordagem orientada a funcionalidades e componentes:

```

/src
|-- /components/
|   |-- /ui/                \# Componentes de UI genéricos (Button, Modal, Tooltip, etc.)
|   |-- /feature/           \# Componentes específicos (ItemList, ProcessItem, etc.)
|-- /contexts/              \# Gerenciamento de estado global
|   |-- ProductContext.tsx
|-- /tabs/                  \# Componentes para cada aba principal
|   |-- CadastroTab.tsx
|   |-- ComposicaoTab.tsx
|   |-- AcabamentosTab.tsx
|-- /types/                 \# Definições de tipos do TypeScript
|   |-- product.ts
|-- App.tsx                 \# Componente raiz da aplicação
|-- index.css               \# Estilos globais e variáveis CSS

````

## 3. Modelo de Dados e Tipagem (`/types/product.ts`)

A tipagem forte é o contrato que garante a integridade dos dados em toda a aplicação.

```typescript
// O estado completo do formulário do produto
export interface ProductState {
  id: string | null;
  name: string;
  unit: 'm2' | 'ml' | 'un' | 'fixed'; [cite_start]// Unidade de Venda [cite: 297]
  fixedDimensions: {
    width: number;
    height: number;
  };
  pricing: {
    strategy: 'margin' | 'markup' | 'fixed'; [cite_start]// Estratégia de preço [cite: 297]
    marginPercent: number; [cite_start]// [cite: 297]
    markupPercent: number; [cite_start]// [cite: 297]
    fixedPrice: number;    [cite_start]// [cite: 297]
  };
  processes: ProcessItem[];       // Mapeia para `product_processes`
  materials: MaterialItem[];      // Mapeia para `product_materials`
  finishes: FinishItem[];         // Mapeia para `product_finishes`
  internalNotes: string;
}

// Item de processo na composição
export interface ProcessItem {
  id: string; // UUID
  processId: string; // ID do processo original
  name: string;
  sequenceOrder: number; [cite_start]// Ordem de execução [cite: 297]
  timeFormula: string;   [cite_start]// Fórmula para calcular o tempo [cite: 297]
}

// Item de material na composição
export interface MaterialItem {
  id: string; // UUID
  materialId: string; // ID do material original
  name: string;
  consumptionFormula: string; [cite_start]// Fórmula para calcular o consumo [cite: 297]
  wastePercentage: number;    [cite_start]// Percentual de desperdício [cite: 297]
  conditionFormula?: string;  [cite_start]// Condição para inclusão do material [cite: 297]
}

// Item de acabamento opcional
export interface FinishItem {
  id: string; // UUID
  finishId: string; // ID do acabamento original
  name: string;
  additionalMarkup: number; [cite_start]// Markup de acréscimo [cite: 297]
}
````

## 4\. Gerenciamento de Estado (`ProductContext.tsx`)

Para gerenciar o estado complexo e compartilhado do formulário, utilizaremos o padrão `useReducer` com `Context API`.

  * **Estado (`state`):** Um único objeto `ProductState` conterá todos os dados do formulário.
  * **Ações (`actions`):** Objetos tipados descreverão as mutações de estado (ex: `UPDATE_FIELD`, `ADD_PROCESS`, `REMOVE_MATERIAL`, `REORDER_ITEMS`).
  * **Redutor (`reducer`):** Uma função pura receberá o estado atual e uma ação, e retornará o novo estado. Toda a lógica de negócio para atualização do estado reside aqui.
  * **Despacho (`dispatch`):** Os componentes filhos não modificarão o estado diretamente. Eles chamarão a função `dispatch` com uma ação apropriada.

Este padrão garante um fluxo de dados unidirecional e previsível, essencial para a depuração e manutenção do sistema.

## 5\. Detalhamento dos Componentes

### `App.tsx`

  * **Responsabilidade:** Componente raiz. Inicializa o `ProductProvider` para prover o estado e a função `dispatch` para toda a árvore de componentes. Renderiza o layout principal (header, navegação por abas e o contêiner das abas).
  * **Lógica:** Controla qual aba está ativa e renderiza o componente da aba correspondente.

### `/tabs/CadastroTab.tsx`

  * **Responsabilidade:** Renderizar todos os campos da aba "Cadastro".
  * **Props:** Recebe o `state` e `dispatch` do contexto.
  * **Lógica Principal:**
      * Renderiza os componentes `FormGroup` para cada campo (Nome, Unidade, etc.).
      * [cite\_start]Controla a exibição condicional dos campos de dimensão fixa quando `unit === 'fixed'`[cite: 297].
      * [cite\_start]Controla a exibição dos campos de `margin`, `markup` ou `fixedPrice` com base na `pricing.strategy` selecionada[cite: 297].
      * Nos eventos `onChange` dos inputs, dispara a ação `dispatch({ type: 'UPDATE_FIELD', ... })`.
      * Exibe os preços sugeridos calculados em tempo real com base nos valores do estado.

### `/tabs/ComposicaoTab.tsx`

  * **Responsabilidade:** Orquestrar a exibição e manipulação das listas de processos e materiais.
  * **Lógica Principal:**
      * Utiliza o componente `ItemList` para renderizar as seções de Processos e Materiais.
      * Mapeia (`.map()`) sobre os arrays `state.processes` e `state.materials` para renderizar os componentes `ProcessItem` e `MaterialItem`.
      * Implementa a lógica de `dnd-kit` para reordenar os itens, disparando a ação `dispatch({ type: 'REORDER_ITEMS', ... })` ao final do arrasto.

### `/feature/MaterialItem.tsx`

  * **Responsabilidade:** Exibir um único material na lista de composição.
  * **Props:**
      * `material: MaterialItem`
      * `onUpdate: (field, value) => void`
      * `onRemove: () => void`
  * **Lógica Principal:**
      * [cite\_start]Renderiza os campos de input para `consumptionFormula`, `wastePercentage` e `conditionFormula`[cite: 297].
      * Em cada `onChange`, chama a prop `onUpdate` para que o componente pai dispare a atualização no estado global.
      * O botão de remoção chama a prop `onRemove`.

### `/ui/Modal.tsx`

  * **Responsabilidade:** Fornecer uma janela modal genérica e acessível.
  * **Props:** `isOpen`, `onClose`, `title`, `children`.
  * **Lógica:** Controla sua própria visibilidade com base na prop `isOpen`. Lida com o fechamento (via botão, tecla 'Esc', clique no overlay).

## 6\. Lógica de Negócio Inviolável

Estas regras devem ser implementadas com rigor.

1.  **Cálculo de Preço (Estratégias):**

      * [cite\_start]**Margem:** `Preço = CustoTotal / (1 - (margin_percentage / 100))`[cite: 297].
      * [cite\_start]**Markup:** `Preço = CustoTotal * (1 + (markup_percentage / 100))`[cite: 297].
      * O `CustoTotal` é uma simulação no protótipo, mas na aplicação real, virá de um cálculo que soma os custos de todos os processos e materiais da composição.

2.  **Validação de Fórmulas:**

      * [cite\_start]**Client-side:** Validações básicas de sintaxe (ex: parênteses desbalanceados) e alerta sobre divisão por zero[cite: 293, 294].
      * **Server-side (Implícito):** A validação final e segura das fórmulas DEVE ocorrer no backend antes da persistência.

3.  [cite\_start]**Persistência (Snapshot):** Ao salvar, os custos e preços calculados são "congelados" e salvos no `quote_items`, garantindo a integridade histórica daquele orçamento[cite: 57]. O protótipo deve comunicar essa filosofia.

## 7\. Plano de Implementação (Roadmap Sugerido)

1.  **Fase 1: Estrutura e UI Estática**

      * Configurar o projeto React + TS.
      * Criar todos os arquivos de componentes com JSX estático, sem lógica.
      * Implementar todo o CSS (CSS Modules) e as variáveis de tema.

2.  **Fase 2: Estado e Interatividade**

      * Implementar o `ProductContext` com o `reducer` e as ações principais.
      * Conectar os componentes ao contexto para ler o estado e disparar ações.
      * Tornar os formulários interativos e habilitar a adição/remoção de itens nas listas.

3.  **Fase 3: Lógica Avançada e Refinamento**

      * Integrar a biblioteca `dnd-kit` para a funcionalidade de reordenação.
      * Implementar a lógica de busca nos modais e os cálculos de preço em tempo real.
      * Refinar a validação de formulários e o feedback ao usuário (toasts, mensagens de erro).

<!-- end list -->

```
```
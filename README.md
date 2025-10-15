# MWM Portal - Plataforma de Monitoramento Agroindustrial

Este é o repositório para o MWM Portal, uma aplicação web moderna e interativa para monitoramento de dados e métricas de abastecimento e faturamento em tempo real, construída com as melhores práticas de engenharia de software.

## Visão Geral do Projeto

O projeto consiste em um portal de Business Intelligence que oferece uma visão consolidada e detalhada de operações agroindustriais. A aplicação é construída com tecnologias web modernas para garantir uma experiência de usuário fluida, responsiva e rica em visualizações de dados.

## 🚀 Tecnologias e Ferramentas

| Categoria | Tecnologia/Ferramenta | Descrição |
|---|---|---|
| **Core** | React & TypeScript | Base para construção de interfaces de usuário robustas e tipadas. |
| **Build & Dev** | Vite | Ambiente de desenvolvimento extremamente rápido com HMR (Hot Module Replacement). |
| **Gerenciamento de Estado**| Redux Toolkit & React-Redux | Para um gerenciamento de estado global eficiente, previsível e escalável. |
| **Roteamento** | React Router | Navegação declarativa e gerenciamento de rotas na aplicação. |
| **Estilização** | Bulma & React Icons | Framework CSS moderno e leve, complementado por uma vasta biblioteca de ícones. |
| **Visualização de Dados**| Recharts | Biblioteca de gráficos para visualização de dados interativos. |
| **Testes Unitários** | Vitest & React Testing Library | Suíte de testes unitários e de integração rápida, com foco no comportamento do componente. |
| **Testes E2E** | Playwright | Testes de ponta a ponta (E2E) e de componentes em navegadores reais para máxima confiança. |
| **Linting** | ESLint & TypeScript ESLint | Análise estática de código para encontrar problemas e manter a consistência. |
| **Utilitários** | Moment.js & UUID | Manipulação de datas e geração de identificadores únicos. |

## 🏛️ Estrutura de Pastas

A organização do projeto segue um padrão modular para facilitar a localização de arquivos e a escalabilidade.

src/
├── app/          # Configuração da store e hooks do Redux.
├── components/   # Componentes reutilizáveis (gráficos, cards, modais, etc.).
├── context/      # Provedores de Contexto React (ex: AuthContext, ThemeContext).
├── features/     # Slices e lógica de estado do Redux (ex: abastecimento, coleta).
├── hooks/        # Hooks customizados (ex: useTheme, useAuth).
├── screens/      # Componentes de página (telas principais da aplicação).
├── services/     # Lógica de acesso a dados (API mockada).
└── styles/       # Arquivos de estilização globais e temas.
e2e/
└── ...           # Testes de ponta a ponta (E2E) com Playwright.

## Funcionalidades Implementadas

A aplicação conta com diversas telas e funcionalidades para análise de dados:

### 1. Sistema de Autenticação e Controle de Acesso (RBAC)
A camada de autenticação foi aprimorada para um modelo de controle de acesso baseado em perfis (RBAC - Role-Based Access Control) e filiais.
- **Login**: Tela inicial para acesso do usuário.
- **Recuperação de Senha**: Tela para solicitação de redefinição de senha por e-mail.
- **Criação de Nova Senha**: Tela para criar uma nova senha a partir de um link de redefinição.
- **Proteção de Rotas**: O acesso às telas principais é restrito a usuários autenticados.
- **Controle de Acesso por Perfil**: As permissões de acesso a funcionalidades (como adicionar ou editar registros) são controladas pelo perfil do usuário (`administrador`, `editor`, `leitor`).

### 2. Dashboard (`Dashboard.tsx`)
A tela principal, que oferece uma visão geral e consolidada dos indicadores mais importantes.
- **Busca de Dados**: Busca dados de forma assíncrona da API mockada (`/src/services/api.ts`), exibindo estados de "Carregando..." e de erro.
- **Cards de Métricas**: Exibem os principais KPIs, como densidade, volume e status operacional.
- **Status do Estoque**: Mostra os níveis de estoque de diferentes itens (Fertilizantes, Bio Metano, etc.) através de barras de progresso.
- **Análise de Cooperados**: Um gráfico de barras que apresenta a "Análise de Cooperados", permitindo uma visualização rápida do desempenho.
- **Gráfico de Abastecimento**: Um gráfico de pizza (Donut Chart) que exibe o volume total abastecido por veículo.

### 3. Relatório de Abastecimento (`AbastecimentoReport.tsx`)
Uma tela detalhada para análise aprofundada dos dados de abastecimento, contendo múltiplas visualizações e interações.
- **Gerenciamento de Estado com Redux**: O estado da UI (filtros de data, paginação, etc.) foi movido do estado local do React para o Redux, centralizando a lógica e facilitando o gerenciamento.
- **Busca de Dados Otimizada**: Carrega todos os dados necessários para a tela em paralelo (`Promise.all`), melhorando a performance de carregamento.
- **Sumário por Veículo**: Apresenta uma tabela e um gráfico de barras lado a lado, mostrando o volume total abastecido por veículo e placa.
- **Gráficos Detalhados**:
  - **Volume por Dia**: Gráfico de linhas que mostra a evolução do volume total abastecido ao longo do tempo.
  - **Volume vs. Odômetro**: Gráfico de dispersão (Scatter Plot) que correlaciona o volume abastecido com a quilometragem do veículo, usando cores para diferenciar as placas.
  - **Volume por Produto**: Gráfico de pizza que detalha a proporção de cada produto abastecido.
  - **Nº de Abastecimentos por Usuário**: Gráfico de barras que compara a quantidade de operações realizadas por cada usuário.
- **Relatório Completo com Cadastro**:
  - Uma tabela exibe todos os registros de abastecimento.
  - Um botão **"Adicionar Registro"** abre um modal (`AbastecimentoFormModal.tsx`) com um formulário para cadastrar um novo abastecimento. Ao submeter, o novo dado é "salvo" na API mockada e **toda a tela de relatório é atualizada em tempo real**, refletindo a nova entrada em todas as tabelas e gráficos.

### 4. Tela de Abastecimentos (`Abastecimentos.tsx`)
Focada na análise temporal dos volumes de abastecimento.
- **Filtros por Período**: Permite ao usuário alternar a visualização dos dados por **Dia, Semana ou Mês**.
- **Gráfico de Linhas Dinâmico**: Exibe o volume total abastecido, agregado de acordo com o período selecionado no filtro. A API mockada foi aprimorada para fornecer esses dados já agrupados.

### 5. Tela de Faturamentos (`Faturamentos.tsx`)
Oferece uma visão comparativa entre faturamento e abastecimento.
- **Gráficos Comparativos**: Exibe dois gráficos de barras lado a lado:
  1. Faturamentos Realizados (R$) por mês.
  2. Abastecimentos Realizados (m³) por mês.
- **Sincronização de Dados**: A API foi atualizada para que os dados de abastecimento desta tela sejam consistentes com os do restante da aplicação, garantindo uma fonte de verdade única.

### 6. Módulo de Cooperados (`Cooperados.tsx`)
O módulo foi refatorado para ter um novo layout de tabela na aba "Agenda".
- **Abas de Navegação**: A tela agora possui abas "Cadastro" e "Agenda".
- **Tabela de Cadastro**: O layout da tabela de cooperados foi ajustado para ser mais responsivo e fiel ao design, com botões de ação alinhados.
- **Tabela da Agenda**: A antiga visualização de calendário foi substituída por um layout de tabela detalhada, com a grade completa dos dias da semana. A hierarquia de cores no tema claro e escuro foi aprimorada para destacar o status "Realizado" (Agrocampo) com verde e "Planejado" (Primato) com azul. A linha de total da tabela "Planejado" foi ajustada para não somar a coluna de KM, refletindo as regras de negócio.

### 7. Gerenciamento de Estado com Redux
- **Estado Centralizado**: O estado da aplicação, antes gerenciado localmente em componentes, foi refatorado para usar o Redux Toolkit. Isso centraliza a lógica de estado, tornando-a mais previsível e fácil de depurar.
- **Tela de Relatório de Abastecimento**: A tela `AbastecimentoReport.tsx` foi completamente refatorada para utilizar o Redux. Estados como filtros de data, paginação e visibilidade de modais agora são gerenciados pelo *slice* `abastecimentoSlice`, e as ações são despachadas para atualizar o estado global.

## 🔌 Integração com Backend (Próximos Passos)

Atualmente, a aplicação utiliza uma camada de serviço mockada (`src/services/api.ts` e `src/services/auth.ts`) que simula o comportamento de uma API real.

O próximo passo crucial do projeto é a integração com o backend definitivo, que será desenvolvido em **Java com Spring Boot** e utilizará um banco de dados **SQL Server**. A camada de serviço existente será refatorada para substituir as funções mockadas por chamadas HTTP (utilizando `fetch` ou `axios`) aos endpoints da API real. A estrutura de tipos (interfaces TypeScript) já definida será mantida para garantir a consistência e a segurança dos dados trafegados entre o frontend e o backend.

## Como Executar o Projeto

1.  **Instalar as dependências**:
    ```bash
    npm install
    ```

2.  **Iniciar o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173` (ou na porta que o Vite designar).

### 👤 Usuários de Teste (API Mockada)

Para testar as diferentes funcionalidades e perfis, utilize os seguintes usuários de login com a API mockada:
| Usuário   | Senha     | Perfil        | Filiais                   |
|-----------|-----------|---------------|---------------------------|
| `admin`   | `admin123`  | `administrador` | `Toledo - PR`, `Cascavel - PR` |
| `editor`  | `editor123` | `editor`        | `Toledo - PR`             |
| `porteiro`| `leitor123` | `leitor`        | `Toledo - PR`             |

### 🧪 Testes

O projeto possui uma suíte de testes completa para garantir a qualidade e a estabilidade do código.

#### Testes Unitários e de Integração (Vitest)
- **`npm test`**: Roda os testes uma vez no terminal.
- **`npm run test:ui`**: Abre a interface gráfica do Vitest para uma experiência de teste interativa e visual.

#### Testes de Componente e Ponta a Ponta (Playwright)
- **`npm run test:ct`**: Executa os testes de componente com Playwright.
- **`npm run test:e2e`**: Executa os testes de ponta a ponta (E2E) em modo headless.
- **`npm run test:e2e:ui`**: Abre a interface do Playwright para executar e depurar os testes E2E visualmente.

## ✨ Qualidade de Código e Boas Práticas

Durante o desenvolvimento, foram aplicadas diversas boas práticas para garantir um código limpo, performático e de fácil manutenção:

- **Componentização**: A interface foi dividida em componentes pequenos e reutilizáveis.
- **Tipagem Forte**: O uso de TypeScript e interfaces (`type`) para importação de tipos garante a segurança e a clareza dos dados.
- **Testes Abrangentes**: Cobertura de testes em múltiplas camadas (unitário, integração, E2E) para garantir a funcionalidade de ponta a ponta.
- **Chaves Estáveis**: Em listas e laços de repetição, foram utilizadas chaves (`key`) únicas e estáveis em vez de índices, prevenindo bugs de renderização e otimizando a performance.
- **Hooks do React**: O estado e o ciclo de vida dos componentes são gerenciados de forma moderna com `useState`, `useEffect` e hooks customizados.
- **Gerenciamento de Estado Centralizado**: A utilização do Redux Toolkit para estados globais desacopla a lógica de estado da UI, melhorando a testabilidade e a organização do código.
- **Tratamento de Estado Assíncrono**: As telas lidam de forma elegante com os estados de carregamento (`loading`) e erro (`error`) durante as buscas de dados.
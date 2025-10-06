# MWM Portal - Dashboard de Monitoramento

Este é o repositório para o MWM Portal, uma aplicação web moderna e interativa para monitoramento de dados e métricas de abastecimento e faturamento em tempo real, construída com as melhores práticas de engenharia de software.

## Visão Geral do Projeto

O projeto consiste em um portal de Business Intelligence que oferece uma visão consolidada e detalhada de operações agroindustriais. A aplicação é construída com tecnologias web modernas para garantir uma experiência de usuário fluida, responsiva e rica em visualizações de dados.

## Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| **React** | Biblioteca principal para a construção da interface de usuário. |
| **TypeScript** | Adiciona tipagem estática ao JavaScript, aumentando a robustez e a manutenibilidade do código. |
| **Vite** | Ferramenta de build moderna que oferece um ambiente de desenvolvimento rápido. |
| **Bulma** | Framework CSS leve e baseado em Flexbox para estilização. |
| **Recharts** | Biblioteca de gráficos para visualização de dados. |
| **Vitest & React Testing Library** | Para a suíte de testes unitários e de integração. |
| **react-router-dom** | Gerenciamento de rotas e navegação na aplicação. |

## Estrutura de Pastas

A organização do projeto segue um padrão modular para facilitar a localização de arquivos e a escalabilidade.

src/
├── components/   # Componentes reutilizáveis (gráficos, cards, modais, etc.)
├── hooks/        # Hooks customizados (ex: useTheme).
├── screens/      # Componentes de página (telas principais da aplicação).
├── services/     # Lógica de acesso a dados (atualmente, a API mockada).
├── context/      # Contexto global da aplicação (ex: AuthContext).
└── styles/       # Arquivos de estilização globais e temas.

## Funcionalidades Implementadas

A aplicação conta com diversas telas e funcionalidades para análise de dados:

### 1. Sistema de Autenticação e Proteção de Rotas
Uma nova camada foi adicionada para controlar o acesso à aplicação.
- **Login**: Tela inicial para acesso do usuário, com validação de credenciais.
- **Recuperação de Senha**: Tela para solicitação de redefinição de senha por e-mail.
- **Criação de Nova Senha**: Tela para criar uma nova senha a partir de um link de redefinição.
- **Proteção de Rotas**: As telas de Dashboard, Relatórios e Faturamentos são acessíveis apenas a usuários autenticados, redirecionando-os para a tela de login caso a sessão não esteja ativa.
- **Estado Global**: O estado de autenticação é gerenciado globalmente com o React Context, persistindo a sessão mesmo após um refresh da página.

### 2. Dashboard (`Dashboard.tsx`)
A tela principal, que oferece uma visão geral e consolidada dos indicadores mais importantes.
- **Busca de Dados**: Busca dados de forma assíncrona da API mockada (`/src/services/api.ts`), exibindo estados de "Carregando..." e de erro.
- **Cards de Métricas**: Exibem os principais KPIs, como densidade, volume e status operacional.
- **Status do Estoque**: Mostra os níveis de estoque de diferentes itens (Fertilizantes, Bio Metano, etc.) através de barras de progresso.
- **Análise de Cooperados**: Um gráfico de barras que apresenta a "Análise de Cooperados", permitindo uma visualização rápida do desempenho.
- **Gráfico de Abastecimento**: Um gráfico de pizza (Donut Chart) que exibe o volume total abastecido por veículo.

### 3. Relatório de Abastecimento (`AbastecimentoReport.tsx`)
Uma tela detalhada para análise aprofundada dos dados de abastecimento, contendo múltiplas visualizações e interações.

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

## Backend Integration (Próximos Passos)

Atualmente, a aplicação utiliza uma camada de serviço mockada (`src/services/api.ts`) que simula o comportamento de uma API real, incluindo latência e agregação de dados.

O próximo passo crucial do projeto é a integração com o backend definitivo, que será desenvolvido em **Java com Spring Boot** e utilizará um banco de dados **SQL Server**. A camada de serviço existente será refatorada para substituir as funções mockadas por chamadas HTTP (utilizando `fetch` ou `axios`) aos endpoints da API real. A estrutura de tipos (interfaces TypeScript) já definida será mantida para garantir a consistência e a segurança dos dados trafegados entre o frontend e o backend.

## Como Executar o Projeto

1.  **Instalar as dependências:**
    ```bash
    npm install
    ```

2.  **Iniciar o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173` (ou na porta que o Vite designar).

### Testes

O projeto utiliza **Vitest** e **React Testing Library** para testes unitários e de integração. Foram criados testes para os principais componentes e para a página de Dashboard, cobrindo:

- Renderização dos componentes com diferentes props.
- Lógica de carregamento, sucesso e erro da página de Dashboard.

Para executar os testes, utilize os seguintes comandos:

- `npm test`: Roda os testes uma vez no terminal.
- `npm run test:ui`: Abre a interface gráfica do Vitest para uma experiência de teste interativa.

## Qualidade de Código e Boas Práticas

Durante o desenvolvimento, foram aplicadas diversas boas práticas para garantir um código limpo, performático e de fácil manutenção:

- **Componentização**: A interface foi dividida em componentes pequenos e reutilizáveis.
- **Tipagem Forte**: O uso de TypeScript e interfaces (`type`) para importação de tipos garante a segurança e a clareza dos dados.
- **Chaves Estáveis**: Em listas e laços de repetição, foram utilizadas chaves (`key`) únicas e estáveis em vez de índices, prevenindo bugs de renderização e otimizando a performance.
- **Hooks do React**: O estado e o ciclo de vida dos componentes são gerenciados de forma moderna com `useState` and `useEffect`.
- **Tratamento de Estado Assíncrono**: As telas lidam de forma elegante com os estados de carregamento (`loading`) e erro (`error`) durante as buscas de dados.
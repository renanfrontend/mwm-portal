# MWM Portal - Dashboard de Monitoramento

Este é o repositório para o MWM Portal, uma aplicação web desenvolvida para monitorar dados e métricas importantes em tempo real.

## Visão Geral do Projeto

O projeto foi iniciado com o objetivo de criar um dashboard centralizado que exibe indicadores chave de performance (KPIs), status de estoque e análises de cooperados. A aplicação é construída com tecnologias web modernas para garantir uma experiência de usuário fluida e responsiva.

## Tecnologias Utilizadas

- **React**: Biblioteca principal para a construção da interface de usuário.
- **TypeScript**: Para adicionar tipagem estática ao JavaScript, aumentando a robustez e a manutenibilidade do código.
- **Vite**: Ferramenta de build moderna que oferece um ambiente de desenvolvimento rápido.
- **Bulma**: Framework CSS leve e baseado em Flexbox para estilização.
- **Recharts**: Biblioteca de gráficos para visualização de dados.

## Funcionalidades Implementadas

Até o momento, o foco principal foi a construção da tela de Dashboard, que inclui:

1.  **Busca de Dados**: A tela busca dados de forma assíncrona de uma API mockada (`/src/services/api.ts`), exibindo estados de "Carregando..." e de erro.
2.  **Cards de Métricas (`MetricCard`)**: Exibem os principais KPIs, como densidade, volume e status operacional.
3.  **Status do Estoque (`StockStatus`)**: Um componente que mostra os níveis de estoque de diferentes itens (Fertilizantes, Bio Metano, etc.) através de barras de progresso.
4.  **Gráfico de Análise (`CooperativeAnalysisChart`)**: Um gráfico de barras que apresenta a "Análise de Cooperados", permitindo uma visualização rápida do desempenho.
5.  **Componentes Reutilizáveis**: A estrutura do projeto foi organizada em componentes para facilitar a manutenção e a escalabilidade.

## Como Executar o Projeto

### Testes

O projeto utiliza **Vitest** e **React Testing Library** para testes unitários e de integração. Foram criados testes para os principais componentes e para a página de Dashboard, cobrindo:

- Renderização dos componentes com diferentes props.
- Lógica de carregamento, sucesso e erro da página de Dashboard.

Para executar os testes, utilize os seguintes comandos:

- `npm test`: Roda os testes uma vez no terminal.
- `npm run test:ui`: Abre a interface gráfica do Vitest para uma experiência de teste interativa.

1.  **Instalar as dependências:**
    ```bash
    npm install
    ```

2.  **Iniciar o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173` (ou na porta que o Vite designar).

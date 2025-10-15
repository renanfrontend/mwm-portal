// src/screens/Dashboard.spec.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import Dashboard from './Dashboard';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/dashboardSlice';

// Mock da API para não fazer chamadas reais
test.beforeEach(async ({ page }) => {
  await page.route('**/api/dashboard', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        metrics: [
          { id: 1, icon: 'density_medium', label: 'Densidade dos dejetos', value: 1014, trend: 'up' },
          { id: 2, icon: 'water_drop', label: 'Volume recebido', value: '34.6M', trend: 'up', unit: 'M³' },
        ],
        stock: [],
        cooperativeAnalysis: [],
      }),
    });
  });
  await page.route('**/api/abastecimento/summary', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
});

const createStore = () => configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});

test.use({ viewport: { width: 1280, height: 720 } });

test('deve renderizar o Dashboard e exibir o título', async ({ mount }) => {
  const store = createStore();

  const component = await mount(
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );

  // Espera o título "Dashboard" aparecer na tela
  await expect(component.getByText('Dashboard')).toBeVisible();

  // Espera os cards de métrica serem renderizados
  await expect(component.getByText('Densidade dos dejetos')).toBeVisible();
  await expect(component.getByText('Volume recebido')).toBeVisible();
});

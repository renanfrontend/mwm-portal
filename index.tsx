import React from 'react';
import { beforeMount, afterMount } from '@playwright/experimental-ct-react/hooks';

// Importe aqui seus estilos globais, se houver
// import '../src/styles/main.scss';

beforeMount(async ({ hooksConfig }) => {
  console.log(`Running test: ${hooksConfig.test.title}`);
});

afterMount(async ({ instance }) => {});
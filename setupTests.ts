import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
// import { server } from './src/mocks/server'; // Comentei esta linha pois o arquivo não existe.

// Para usar mocks de API, você precisará criar o arquivo `src/mocks/server.ts` e `src/mocks/handlers.ts`.
// Por enquanto, comente as chamadas para permitir que outros testes passem.
// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// O setup agora apenas habilita o jest-dom sem o servidor de mocks.
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Los alias se repiten acá porque Vitest no lee `tsconfig.paths` por su cuenta.
const raiz = (ruta: string) => fileURLToPath(new URL(ruta, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@data': raiz('./src/data'),
      '@lib': raiz('./src/lib'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});

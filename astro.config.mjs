// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const estilos = fileURLToPath(new URL('./src/styles', import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://hakui-medical.vercel.app',
  output: 'static',
  integrations: [react()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // `loadPaths` deja que sass resuelva `@use "abstracts"` sin rutas relativas.
          // Los alias de Vite no llegan al preprocesador, por eso no basta con tsconfig.
          loadPaths: [estilos],
          additionalData: '@use "abstracts" as *;\n',
        },
      },
    },
  },
});

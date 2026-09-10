// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const estilos = fileURLToPath(new URL('./src/styles', import.meta.url));

// La página de referencia del sistema de diseño existe solo en desarrollo.
// Vive fuera de `src/pages/` y se inyecta como ruta únicamente con `astro dev`,
// así no aparece en `dist/` ni hace falta acordarse de borrarla antes de publicar.
/** @type {import('astro').AstroIntegration} */
const referenciaSoloEnDesarrollo = {
  name: 'referencia-solo-en-desarrollo',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command !== 'dev') return;
      injectRoute({ pattern: '/dev/estilos', entrypoint: './src/pages-dev/estilos.astro' });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://hakui-medical.vercel.app',
  output: 'static',
  integrations: [react(), referenciaSoloEnDesarrollo],
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

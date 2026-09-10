# Hakui Medical — landing de demostración

Landing de una sola página para una clínica ambulatoria de seis especialidades. Es un **sitio de demostración comercial**: sirve para que un cliente potencial abra la URL, la recorra y quiera comprar el producto. No opera la clínica.

## Restricciones del proyecto

- **Sin backend.** Todo se resuelve en el navegador. Nada se envía a ningún servidor.
- **Contenido simulado.** Precios, horarios, profesionales y testimonios son inventados.
- **MVP.** Se prioriza que la demostración se vea y se sienta terminada por encima de la cobertura exhaustiva.

## Arranque

```bash
nvm use          # Node 22.12 o superior
npm install
npm run dev      # http://localhost:4321
```

## Comandos

| Comando           | Qué hace                                                  |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                                    |
| `npm run build`   | Genera el estático en `dist/`                             |
| `npm run preview` | Sirve `dist/` para revisarlo antes de publicar            |
| `npm run lint`    | ESLint sobre todo el proyecto                             |
| `npm run format`  | Prettier en modo escritura                                |
| `npm run check`   | Verificación de tipos de Astro                            |
| `npm run verify`  | Formato, lint, tipos y build. Lo que corre en integración |

## Estructura

```
src/
  components/
    base/          Botones, iconos, piezas reutilizables
    secciones/     Una sección de la landing por archivo
  data/            Contenido simulado, tipado (ONI-15)
  islands/         Componentes React hidratados. Hoy solo el asistente
  layouts/         Layout base con metaetiquetas
  lib/triage/      Motor de orientación por síntomas (ONI-25)
  styles/          Tokens, mixins y estilos globales
docs/              Planificación y decisiones del proyecto
```

## Cómo adaptar la demostración a otro cliente

Todo el contenido de negocio vive en `src/data/`. Para cambiar de clínica no hace falta tocar ningún componente:

1. Reemplaza los módulos de `src/data/` con los datos del cliente.
2. Reemplaza la ilustración de `public/img/`.
3. Ajusta el acento de marca en `src/styles/_tokens.scss`, o pásalo por URL (ONI-40).

### Convención de datos pendientes

Todo dato real que falta se escribe **entre corchetes**: `[Dirección de la sede]`, `[+54 11 0000-0000]`.

Antes de mostrar la demostración a un cliente, búscalos:

```bash
rg '\[[A-ZÁÉÍÓÚÑ][^\]]+\]' src/data
```

## Avisos que no se quitan sin decisión explícita

- **El asistente orienta, no diagnostica.** El aviso es visible en la interfaz, no enterrado en el pie.
- **Los testimonios son simulados.** Presentarlos como reales sin autorización del paciente es un problema, no un detalle.
- **Reservar no reserva nada.** La reserva se guarda solo en el navegador de quien la hace.

## Planificación

El backlog vive en Linear, proyecto **Landing Hakui Medical** (equipo `ONI`). Las decisiones técnicas y su porqué están en [`docs/`](./docs).

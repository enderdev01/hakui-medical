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

### El contenido es ficticio, no está incompleto

No quedan datos por rellenar: nombre, dirección, teléfonos, colegiaturas, registro, precios y testimonios están **inventados** para que la demostración se vea terminada. La clínica no existe.

Los precios están en **soles** y corresponden a valores plausibles de clínica privada limeña, no a una conversión de otra moneda.

Dos excepciones deliberadas:

- **El número de emergencias, 106, es real**: es el SAMU del Perú. Un aviso de urgencias con un teléfono inventado es peor que no tener aviso. Al adaptar el sitio a otro país hay que cambiarlo.
- **Las fechas de la agenda se calculan en el build** a partir del día de hoy. Una fecha fija envejece mal en una demostración que se muestra durante meses: a la semana siguiente la clínica estaría ofreciendo turnos del pasado.

Para volver a marcar un dato como pendiente al adaptar el sitio, está `pendiente()` en `src/data/pendiente.ts`, y la auditoría es:

```bash
grep -rn 'pendiente(' src/data --include='*.ts'
```

## Política de movimiento

En un sitio de salud hay personas con vértigo, migraña o sensibilidad vestibular entre los usuarios reales. El movimiento no es decorativo ni opcional: es un requisito con reglas.

**Al agregar una sección nueva:**

1. **En reposo, todo visible.** Nada arranca en `opacity: 0` esperando a que algo lo revele. Si el JavaScript falla justo cuando el cliente abre la demostración, la página se lee igual.
2. **Solo se animan `transform` y `opacity`.** Animar altura, ancho o posición fuerza recálculo de diseño en cada fotograma. La única excepción declarada es la apertura de las preguntas frecuentes, que no puede hacerse de otra forma.
3. **Toda animación va dentro de `@media (prefers-reduced-motion: no-preference)`**, o queda cubierta por la regla global que las neutraliza.
4. **Con movimiento reducido, nada se vuelve invisible ni inalcanzable.** Se quita el movimiento, no el contenido.

**Esto no depende de que alguien se acuerde.** `src/lib/movimiento.test.ts` lee el CSS realmente emitido en `dist/` y falla si aparece una animación fuera de la política, una propiedad cara en una keyframe o un bloque que arranca invisible. La prueba está verificada contra una violación deliberada: la detecta.

```bash
npm run verify   # construye y después corre la prueba sobre el CSS emitido
```

## Avisos que no se quitan sin decisión explícita

- **El asistente orienta, no diagnostica.** El aviso es visible en la interfaz, no enterrado en el pie.
- **Los testimonios son inventados, y ahora llevan nombres que parecen reales.** Eso los vuelve más riesgosos, no menos: presentarlos como testimonios genuinos sin autorización del paciente es un problema legal y ético, no un detalle de contenido. Antes de publicar para una clínica real hay que reemplazarlos por testimonios autorizados o retirar la sección.
- **Reservar no reserva nada.** La reserva se guarda solo en el navegador de quien la hace.

## Planificación

El backlog vive en Linear, proyecto **Landing Hakui Medical** (equipo `ONI`). Las decisiones técnicas y su porqué están en [`docs/`](./docs).

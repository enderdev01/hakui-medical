# Decisiones técnicas

Cada decisión con el porqué, para no volver a discutirlas dentro de tres meses.

## Astro, no Next.js ni Remix

**Remix** se descartó de entrada: su arquitectura son `loaders` y `actions`, es decir servidor. Sin backend estaríamos peleando contra el framework para no usar el 70 % de lo que ofrece.

**Next.js** funciona con `output: 'export'`, pero su valor son Server Components, route handlers y server actions — todo backend. Envía un runtime de React completo para una página donde un solo componente es interactivo.

**Astro** manda cero JavaScript por defecto. La landing entera es HTML estático y el asistente es la única isla que hidrata. Para una demostración comercial eso importa más de lo que parece: se abre Lighthouse delante del cliente y el número habla solo. Y no es callejón sin salida: Astro tiene adaptadores de servidor y endpoints si mañana hay agenda real.

> La versión instalada es **Astro 7**, no la 5 que figuraba en la estimación inicial. No cambia ninguna decisión.

## SCSS, no Tailwind

Decisión del cliente interno. El diseño ya está definido en tokens, así que el sistema vive en `src/styles/_tokens.scss` como custom properties y ninguna hoja de sección declara un color literal.

## Fuentes autohospedadas

Manrope 600–700 en títulos, Inter 400–500 en cuerpo e interfaz, servidas con `@fontsource-variable` desde el propio dominio.

No es una preferencia estética: una demostración comercial tiene que abrir bien con el wifi del cliente, que suele ser malo. Además evita una petición a un tercero, lo que simplifica el discurso de privacidad en un sitio de salud.

## Contacto por WhatsApp, no formulario

Sin backend, un formulario promete un envío que nadie recibe. Un enlace `wa.me` con mensaje prellenado funciona de verdad, es lo que una clínica de este tamaño usa igual, y arrastra la especialidad que sugirió el asistente.

## Reserva simulada persistida en el navegador

El cliente agenda, recarga la página y su cita sigue ahí. Vende mucho mejor que un botón muerto.

Va en `localStorage` bajo clave con versión y dentro de `try/catch`: en navegación privada el acceso lanza excepción en algunos navegadores. Hay una forma visible de cancelarla para dejar el sitio limpio antes de la próxima reunión.

## El motor de orientación tiene interfaz asíncrona desde el día uno

Hoy es coincidencia de palabras clave sobre reglas declarativas. No hace falta que sea asíncrono para funcionar.

Lo es para que el día que haya un modelo real solo cambie la implementación y ningún componente se entere.

## La ilustración del hero conserva su canal alfa

El PNG entregado es **RGBA con transparencia real**. Se exporta a AVIF y WebP conservándola.

Queda escrito porque ya costó una vuelta: al procesar la imagen se aplastó el alfa contra negro, y eso motivó un `mix-blend-mode` para compensar un problema que no existía. **No se usa `mix-blend-mode` en el hero.**

## Movimiento reducido es una historia propia, no un criterio disperso

Es la clase de requisito que se cumple en cuatro sitios y se olvida en el quinto. En un sitio de salud, esa quinta omisión es la que importa. Por eso hay un mixin único, una auditoría y una prueba automatizada (ONI-32).

## El acento de marca se pasa por URL, pero desde una lista cerrada

Permite cambiar el color de marca en vivo delante del cliente.

Acepta solo valores de una lista predefinida y validada por contraste: aceptar color libre desde la URL permitiría inyectar valores en la hoja de estilos y produciría combinaciones ilegibles justo cuando hay alguien mirando.

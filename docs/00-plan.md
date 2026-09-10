# Plan de desarrollo

Backlog completo en Linear: proyecto **Landing Hakui Medical**, equipo `ONI`. Este documento es el resumen que sobrevive fuera de la herramienta.

## Objetivo

Un cliente potencial abre la URL en su teléfono o su portátil, la recorre en dos minutos y quiere comprarla. Eso es todo. No hay usuarios reales, no hay pacientes, no hay agenda que administrar.

De ahí se derivan las tres restricciones: **sin backend**, **contenido simulado** y **MVP**.

## Épicas

| Épica                            | Issue  | Historias | Puntos  |
| -------------------------------- | ------ | --------- | ------- |
| E1 · Fundaciones                 | ONI-5  | 4         | 13      |
| E2 · Secciones de la landing     | ONI-6  | 9         | 26      |
| E3 · Asistente de citas          | ONI-7  | 5         | 21      |
| E4 · Movimiento                  | ONI-8  | 3         | 11      |
| E5 · Comportamiento responsive   | ONI-9  | 2         | 8       |
| E6 · Calidad                     | ONI-10 | 4         | 16      |
| E7 · Entrega y modo demostración | ONI-11 | 2         | 8       |
|                                  |        | **29**    | **103** |

## Orden de trabajo

E1 bloquea todo lo demás. Después E2 y E3 pueden avanzar en paralelo hasta que E2 necesita el resultado del asistente para el mensaje de WhatsApp (ONI-23 depende de ONI-28). E4 y E5 llegan cuando hay secciones que animar y adaptar. E6 y E7 cierran.

## Qué entra en el MVP

**Camino mínimo** para que la demostración exista y se pueda mostrar: prioridad urgente y alta en Linear.

**Fuera del camino mínimo**: la auditoría de rendimiento, la matriz de navegadores, el posicionamiento y la personalización en vivo. Son deseables y están planificadas, pero la primera demostración no las espera.

La accesibilidad **no** está fuera: se resuelve dentro de cada sección a medida que se escribe, y ONI-35 solo audita lo que ya debería estar bien. En un sitio de salud es exigencia legal en varios países, no una mejora opcional.

## Riesgos asumidos

**Los precios, horarios y testimonios son inventados.** Antes de presentar el sitio como una clínica real hay que reemplazarlos o declararlos como ejemplo.

**El motor del asistente no es inteligencia artificial.** Es coincidencia de palabras clave y funciona bien porque el vocabulario clínico de una demostración es acotado. Al presentarlo conviene decirlo así.

**Sin backend hay un límite real.** Reservar no reserva nada. La reserva simulada vive en el navegador de quien la hace y desaparece si cambia de dispositivo. Alcanza para vender; no alcanza para operar.

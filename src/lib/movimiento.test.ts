import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Política de movimiento reducido, verificada sobre el CSS realmente emitido.
 *
 * Se lee `dist/` y no las fuentes SCSS a propósito: lo que le llega al visitante
 * es el CSS construido. Una regla que el preprocesador mueva de sitio, o un
 * `@media` mal anidado, aparecen acá y no en la fuente.
 *
 * Esta prueba existe porque el movimiento reducido es la clase de requisito que
 * se cumple en cuatro secciones y se olvida en la quinta. En un sitio de salud,
 * esa quinta omisión es la que importa.
 */

const RAIZ = new URL('../../dist', import.meta.url).pathname;

/** Propiedades cuya animación provoca malestar a quien pidió no ver movimiento. */
const MOVIMIENTO = ['transform', 'translate', 'rotate', 'scale'];

function archivosDe(directorio: string, extensiones: string[]): string[] {
  const encontrados: string[] = [];
  for (const entrada of readdirSync(directorio)) {
    const ruta = join(directorio, entrada);
    if (statSync(ruta).isDirectory()) {
      encontrados.push(...archivosDe(ruta, extensiones));
    } else if (extensiones.some((ext) => entrada.endsWith(ext))) {
      encontrados.push(ruta);
    }
  }
  return encontrados;
}

function cssEmitido(): string {
  const archivos = archivosDe(RAIZ, ['.css', '.html']);
  return archivos.map((ruta) => readFileSync(ruta, 'utf8')).join('\n');
}

/** Las dos formas en que el minificador puede escribir la condición. */
function bloquesDePreferencia(css: string, valor: 'reduce' | 'no-preference'): string[] {
  return [
    ...bloquesDeMedia(css, `prefers-reduced-motion:${valor}`),
    ...bloquesDeMedia(css, `prefers-reduced-motion: ${valor}`),
  ];
}

/**
 * Devuelve el CSS que queda fuera de los bloques indicados.
 *
 * Se quita bloque por bloque: unirlos y hacer un solo `replace` no funciona,
 * porque la cadena unida no existe tal cual en el archivo. Ese error hacía que
 * la prueba diera por «fuera» todo el CSS.
 */
function fueraDe(css: string, bloques: string[]): string {
  return bloques.reduce((resto, bloque) => resto.split(bloque).join(''), css);
}

/** Extrae el contenido de cada bloque `@media` cuya condición coincida. */
function bloquesDeMedia(css: string, condicion: string): string[] {
  const bloques: string[] = [];
  let indice = css.indexOf(`@media`);

  while (indice !== -1) {
    const apertura = css.indexOf('{', indice);
    const cabecera = css.slice(indice, apertura);

    if (cabecera.includes(condicion)) {
      let profundidad = 0;
      let cursor = apertura;
      do {
        if (css[cursor] === '{') profundidad += 1;
        if (css[cursor] === '}') profundidad -= 1;
        cursor += 1;
      } while (profundidad > 0 && cursor < css.length);
      bloques.push(css.slice(apertura + 1, cursor - 1));
    }

    indice = css.indexOf('@media', indice + 1);
  }

  return bloques;
}

describe('política de movimiento reducido', () => {
  const css = cssEmitido();

  it('el CSS construido existe y no está vacío', () => {
    expect(css.length).toBeGreaterThan(1000);
  });

  it('hay una regla global que neutraliza animaciones y transiciones', () => {
    const bloques = bloquesDePreferencia(css, 'reduce');

    expect(bloques.length).toBeGreaterThan(0);

    const global = bloques.join('\n');
    expect(global).toContain('animation-duration');
    expect(global).toContain('transition-duration');
    // El selector universal: la red que atrapa lo que nadie se acordó de cubrir.
    expect(global).toMatch(/\*\s*,?/);
  });

  it('las apariciones al desplazar solo existen si el visitante no pidió quietud', () => {
    const permitidos = bloquesDePreferencia(css, 'no-preference');
    expect(permitidos.join('\n')).toContain('.revelar');

    const fuera = fueraDe(css, permitidos);
    const reglasFuera = fuera.match(/\.revelar[^{]*\{[^}]*\}/g) ?? [];
    const conMovimiento = reglasFuera.filter((regla) =>
      /animation(-name)?\s*:|opacity\s*:\s*0/.test(regla),
    );

    expect(conMovimiento).toEqual([]);
  });

  it('ninguna animación en bucle mueve propiedades que fuerzan recálculo de diseño', () => {
    const caras = ['width:', 'height:', 'top:', 'left:', 'margin', 'padding', 'font-size'];
    const keyframes = css.match(/@keyframes[^{]+\{(?:[^{}]*\{[^}]*\})*[^{}]*\}/g) ?? [];

    expect(keyframes.length).toBeGreaterThan(0);

    const infractoras = keyframes.filter((bloque) => caras.some((prop) => bloque.includes(prop)));

    expect(infractoras).toEqual([]);
  });

  it('el desplazamiento suave se apaga con la preferencia activa', () => {
    expect(bloquesDePreferencia(css, 'reduce').join('\n')).toContain('scroll-behavior');
  });

  it('nada queda invisible: no hay opacity 0 fuera de un bloque de movimiento', () => {
    const fuera = fueraDe(css, bloquesDePreferencia(css, 'no-preference'));

    // Un `opacity:0` suelto en una regla de sección es exactamente el fallo que
    // deja la página en blanco si el script no llega a correr.
    const sospechosas =
      fuera.match(/\.(seccion|revelar)[^{]*\{[^}]*opacity:\s*0[^.\d][^}]*\}/g) ?? [];
    expect(sospechosas).toEqual([]);
  });
});

describe('movimiento declarado en las keyframes', () => {
  const css = cssEmitido();

  it('las animaciones de movimiento se declaran con propiedades del compositor', () => {
    const keyframes = css.match(/@keyframes\s+([\w-]+)/g) ?? [];
    expect(keyframes.length).toBeGreaterThan(0);

    // Documenta qué anima el sitio: si aparece una nueva, esta prueba obliga a
    // pensar si respeta la política antes de sumarla.
    const nombres = keyframes.map((k) => k.replace('@keyframes', '').trim()).sort();
    expect(nombres).toEqual(
      expect.arrayContaining([
        'aparecer',
        'desplazar',
        'flotar',
        'girar',
        'latido',
        'revelar',
        'trazar',
      ]),
    );
  });

  it('cada propiedad animada está en la lista permitida', () => {
    const permitidas = new Set([...MOVIMIENTO, 'opacity', 'stroke-dashoffset', 'filter', 'offset']);

    const bloques = css.match(/@keyframes[^{]+\{(?:[^{}]*\{[^}]*\})*[^{}]*\}/g) ?? [];
    const usadas = new Set<string>();

    for (const bloque of bloques) {
      for (const [, prop] of bloque.matchAll(/([a-z-]+)\s*:/g)) {
        if (prop) usadas.add(prop);
      }
    }

    const noPermitidas = [...usadas].filter((prop) => !permitidas.has(prop));
    expect(noPermitidas).toEqual([]);
  });
});

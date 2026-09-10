import type { AreaClinica, PerfilPaciente, Urgencia } from '@data/tipos';
import { normalizar } from './normalizar';
import {
  reglasDeArea,
  reglasDePerfil,
  reglasDeUrgencia,
  SIN_SENALES,
  type ReglaArea,
} from './reglas';

export interface Senal {
  etiqueta: string;
  /** Términos del texto que dispararon la señal. Sirven para explicar la decisión. */
  terminos: string[];
}

export interface Orientacion {
  area: AreaClinica;
  perfil: PerfilPaciente;
  urgencia: Urgencia;
  senales: Senal[];
  /** Verdadero cuando no se reconoció nada y se cayó a medicina general. */
  sinSenales: boolean;
}

/** Longitud mínima para molestarse en analizar. Menos que esto es ruido. */
export const MINIMO_DE_TEXTO = 3;

function coincidencias(texto: string, terminos: string[]): string[] {
  return terminos.filter((termino) => texto.includes(termino));
}

function elegirArea(texto: string): { area: AreaClinica; senales: Senal[] } {
  const encontradas: Array<{ regla: ReglaArea; terminos: string[] }> = [];

  for (const regla of reglasDeArea) {
    const terminos = coincidencias(texto, regla.terminos);
    if (terminos.length > 0) encontradas.push({ regla, terminos });
  }

  if (encontradas.length === 0) {
    return { area: 'general', senales: [] };
  }

  // Gana la que más términos coincide. Ante empate manda la prioridad clínica
  // declarada en la regla, nunca el orden en que aparecen en el arreglo.
  const ganadora = encontradas.reduce((mejor, actual) => {
    if (actual.terminos.length !== mejor.terminos.length) {
      return actual.terminos.length > mejor.terminos.length ? actual : mejor;
    }
    return actual.regla.prioridad > mejor.regla.prioridad ? actual : mejor;
  });

  const senales = encontradas.map((entrada) => ({
    etiqueta: entrada.regla.etiqueta,
    terminos: entrada.terminos,
  }));

  return { area: ganadora.regla.area, senales };
}

function elegirPerfil(texto: string): { perfil: PerfilPaciente; senal?: Senal } {
  for (const regla of reglasDePerfil) {
    const terminos = coincidencias(texto, regla.terminos);
    if (terminos.length > 0) {
      return { perfil: regla.perfil, senal: { etiqueta: regla.etiqueta, terminos } };
    }
  }
  return { perfil: 'adulto' };
}

function elegirUrgencia(texto: string): { urgencia: Urgencia; senal?: Senal } {
  for (const regla of reglasDeUrgencia) {
    const terminos = coincidencias(texto, regla.terminos);
    if (terminos.length > 0) {
      return { urgencia: regla.urgencia, senal: { etiqueta: regla.etiqueta, terminos } };
    }
  }
  return { urgencia: 'flexible' };
}

/**
 * Traduce lo que el paciente escribió en un área clínica, un perfil y un nivel
 * de urgencia, junto con las señales que justifican la decisión.
 *
 * ESTO NO ES INTELIGENCIA ARTIFICIAL. Es coincidencia de palabras clave sobre
 * reglas declarativas, y alcanza porque el vocabulario clínico de una
 * demostración es acotado.
 *
 * La firma es asíncrona a propósito, aunque hoy no haga falta: el día que haya
 * un modelo real detrás, cambia esta implementación y ningún componente se
 * entera.
 */
export async function orientar(entrada: string): Promise<Orientacion> {
  const texto = normalizar(entrada);

  if (texto.length < MINIMO_DE_TEXTO) {
    return {
      area: 'general',
      perfil: 'adulto',
      urgencia: 'flexible',
      senales: [],
      sinSenales: true,
    };
  }

  const { area, senales } = elegirArea(texto);
  const { perfil, senal: senalPerfil } = elegirPerfil(texto);
  const { urgencia, senal: senalUrgencia } = elegirUrgencia(texto);

  const todas = [...senales];
  if (senalPerfil) todas.push(senalPerfil);
  if (senalUrgencia) todas.push(senalUrgencia);

  const sinSenales = todas.length === 0;
  if (sinSenales) todas.push({ etiqueta: SIN_SENALES, terminos: [] });

  return { area, perfil, urgencia, senales: todas, sinSenales };
}

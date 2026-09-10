import type { Arancel } from './tipos';

/**
 * Aranceles particulares de referencia. Valores inventados para la demostración.
 *
 * `columna` decide en cuál de las dos listas de escritorio aparece cada práctica.
 * En móvil se ignora y se muestran todas seguidas.
 */
export const aranceles = [
  {
    id: 'consulta-general',
    practica: 'Consulta de medicina general',
    detalle: '30 minutos · incluye orden de laboratorio',
    precio: 24500,
    columna: 1,
  },
  {
    id: 'consulta-pediatrica',
    practica: 'Consulta pediátrica',
    detalle: '30 minutos · control de crecimiento',
    precio: 27200,
    columna: 1,
  },
  {
    id: 'consulta-orl',
    practica: 'Otorrinolaringología',
    detalle: '35 minutos · incluye otoscopía',
    precio: 31800,
    columna: 1,
  },
  {
    id: 'audiometria',
    practica: 'Audiometría',
    detalle: '40 minutos · con informe escrito',
    precio: 29400,
    columna: 1,
  },
  {
    id: 'consulta-gastro',
    practica: 'Gastroenterología',
    detalle: '35 minutos · plan de estudios digestivos',
    precio: 34600,
    columna: 2,
  },
  {
    id: 'oncologia-primera',
    practica: 'Oncología · primera consulta',
    detalle: '50 minutos · revisión de estudios previos',
    precio: 46900,
    columna: 2,
  },
  {
    id: 'oncologia-control',
    practica: 'Oncología · control',
    detalle: '30 minutos · seguimiento de tratamiento',
    precio: 32700,
    columna: 2,
  },
  {
    id: 'laboratorio-basico',
    practica: 'Laboratorio · perfil básico',
    detalle: 'Sin cita previa de 7 a 10 · resultados en 48 h',
    precio: 18300,
    columna: 2,
  },
] satisfies Arancel[];

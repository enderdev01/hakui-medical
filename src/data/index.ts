// Punto de entrada único del contenido. Los componentes importan de acá,
// nunca de los archivos sueltos, para que reemplazar un módulo entero al
// adaptar la demostración a otro cliente no obligue a tocar imports.

export { clinica } from './clinica';
export { pendiente, pendientes } from './pendiente';
export { especialidades } from './especialidades';
export { aranceles } from './aranceles';
export { preguntas } from './preguntas';
export { testimonios } from './testimonios';
export { proceso, valores } from './proceso';
export { horariosPorUrgencia, citasLibresHoy } from './agenda';
export type * from './tipos';

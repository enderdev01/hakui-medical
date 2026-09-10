import type { Pregunta } from './tipos';

/**
 * Preguntas frecuentes. Alimentan la sección visible y los datos estructurados,
 * para que nunca se contradigan entre sí.
 */
export const preguntas = [
  {
    pregunta: '¿El asistente reemplaza una consulta médica?',
    respuesta:
      'No. Solo orienta a qué especialidad conviene ir y no guarda lo que escribes. El diagnóstico lo hace el profesional en el consultorio.',
    abiertaPorDefecto: true,
  },
  {
    pregunta: '¿Atienden por cobertura o solo particular?',
    respuesta:
      'Trabajamos con coberturas básicas. Lleva credencial y documento; si tu plan no cubre la práctica, te decimos el valor particular antes de pasar.',
  },
  {
    pregunta: '¿Necesito cita para el laboratorio?',
    respuesta:
      'No para los análisis básicos: la extracción es sin cita previa de 7 a 10. Los resultados quedan online en 48 horas.',
  },
  {
    pregunta: '¿Qué pasa si necesito algo que no atienden aquí?',
    respuesta:
      'Somos una clínica pequeña y lo decimos de frente: si el caso excede lo que hacemos, sales de la consulta con la derivación y el resumen listos.',
  },
] satisfies Pregunta[];

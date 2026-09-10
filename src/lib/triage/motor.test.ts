import { describe, expect, it } from 'vitest';
import { consultaPara } from './consulta';
import { orientar } from './motor';
import { normalizar } from './normalizar';

describe('normalizar', () => {
  it('quita tildes, mayúsculas y puntuación', () => {
    expect(normalizar('¡Me DUELE el OÍDO, mucho!')).toBe('me duele el oido mucho');
  });

  it('colapsa espacios repetidos', () => {
    expect(normalizar('dolor    de    panza')).toBe('dolor de panza');
  });
});

describe('orientar · áreas clínicas', () => {
  it('reconoce oídos, nariz y garganta', async () => {
    const r = await orientar('Hace tres días me duele el oído derecho y escucho menos');
    expect(r.area).toBe('orl');
  });

  it('reconoce síntomas digestivos', async () => {
    const r = await orientar('Tengo acidez y ardor de estómago después de comer');
    expect(r.area).toBe('gastro');
  });

  it('reconoce seguimiento oncológico', async () => {
    const r = await orientar('Necesito un control con el oncólogo por la quimio');
    expect(r.area).toBe('oncologia');
  });

  it('reconoce pedidos de estudios', async () => {
    const r = await orientar('Me pidieron un análisis de sangre y colesterol');
    expect(r.area).toBe('laboratorio');
  });

  it('reconoce consulta general', async () => {
    const r = await orientar('Quiero un chequeo anual y el certificado médico');
    expect(r.area).toBe('general');
  });

  it('funciona sin tildes', async () => {
    const r = await orientar('me duele el oido');
    expect(r.area).toBe('orl');
  });
});

describe('orientar · perfil del paciente', () => {
  it('detecta que la consulta es para un menor', async () => {
    const r = await orientar('Mi hija tiene fiebre desde ayer');
    expect(r.perfil).toBe('nino');
  });

  it('detecta que la consulta es para un adulto mayor', async () => {
    const r = await orientar('Mi mamá necesita un control de presión');
    expect(r.perfil).toBe('mayor');
  });

  it('asume adulto cuando no hay señales', async () => {
    const r = await orientar('Tengo acidez');
    expect(r.perfil).toBe('adulto');
  });
});

describe('orientar · urgencia', () => {
  it('detecta urgencia', async () => {
    const r = await orientar('Me duele mucho el oído, es urgente');
    expect(r.urgencia).toBe('hoy');
  });

  it('detecta que puede esperar unos días', async () => {
    const r = await orientar('Quiero un chequeo esta semana');
    expect(r.urgencia).toBe('semana');
  });

  it('asume sin apuro cuando no se dice nada', async () => {
    const r = await orientar('Quiero un chequeo');
    expect(r.urgencia).toBe('flexible');
  });
});

describe('orientar · sin señales', () => {
  it('cae a medicina general y lo declara', async () => {
    const r = await orientar('Hola, quería preguntar una cosa');
    expect(r.area).toBe('general');
    expect(r.sinSenales).toBe(true);
    expect(r.senales).toHaveLength(1);
    expect(r.senales[0]?.etiqueta).toContain('Sin señales claras');
  });

  it('trata el texto vacío como sin señales', async () => {
    const r = await orientar('   ');
    expect(r.sinSenales).toBe(true);
  });
});

describe('orientar · desempate', () => {
  it('ante igual cantidad de coincidencias manda la prioridad clínica', async () => {
    // «oido» y «analisis» coinciden una vez cada uno. Otorrino tiene prioridad
    // sobre laboratorio, así que la consulta va antes que la extracción.
    const r = await orientar('me duele el oido y me pidieron un analisis');
    expect(r.area).toBe('orl');
  });

  it('devuelve todas las señales encontradas, no solo la ganadora', async () => {
    const r = await orientar('me duele el oido y me pidieron un analisis');
    const etiquetas = r.senales.map((senal) => senal.etiqueta);
    expect(etiquetas).toContain('Síntomas de oído, nariz o garganta');
    expect(etiquetas).toContain('Pedido de estudios');
  });
});

describe('consultaPara', () => {
  it('manda a pediatría cuando el paciente es un menor', () => {
    const consulta = consultaPara('orl', 'nino', 'hoy');
    expect(consulta.especialidad).toBe('Pediatría');
  });

  it('no desvía a pediatría un seguimiento oncológico', () => {
    const consulta = consultaPara('oncologia', 'nino', 'hoy');
    expect(consulta.especialidad).toBe('Oncología');
  });

  it('ofrece control integral a un adulto mayor con consulta general', () => {
    const consulta = consultaPara('general', 'mayor', 'flexible');
    expect(consulta.especialidad).toContain('control integral');
    expect(consulta.duracion).toBe(45);
  });

  it('deriva el horario del nivel de urgencia', () => {
    expect(consultaPara('general', 'adulto', 'hoy').horario).toContain('Hoy');
    expect(consultaPara('general', 'adulto', 'semana').horario).toContain('Jueves');
    expect(consultaPara('general', 'adulto', 'flexible').horario).toContain('Martes');
  });
});

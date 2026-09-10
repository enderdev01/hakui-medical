import { describe, expect, it } from 'vitest';
import { codigoDeReserva } from './reserva';

describe('codigoDeReserva', () => {
  const fecha = new Date(2026, 4, 17);

  it('es estable para la misma especialidad y fecha', () => {
    expect(codigoDeReserva('Otorrinolaringología', fecha)).toBe(
      codigoDeReserva('Otorrinolaringología', fecha),
    );
  });

  it('cambia con la especialidad', () => {
    expect(codigoDeReserva('Pediatría', fecha)).not.toBe(codigoDeReserva('Oncología', fecha));
  });

  it('cambia con la fecha', () => {
    const otroDia = new Date(2026, 4, 18);
    expect(codigoDeReserva('Pediatría', fecha)).not.toBe(codigoDeReserva('Pediatría', otroDia));
  });

  it('tiene la forma HK-AAMMDD-XXX', () => {
    expect(codigoDeReserva('Pediatría', fecha)).toMatch(/^HK-\d{6}-[0-9A-Z]{3}$/);
  });
});

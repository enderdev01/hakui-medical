import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { clinica } from '@data/index';
import type { AreaClinica, PerfilPaciente, Urgencia } from '@data/tipos';
import { consultaPara, type ConsultaSugerida } from '@lib/triage/consulta';
import { MINIMO_DE_TEXTO, orientar, type Senal } from '@lib/triage/motor';
import {
  duracion as formatearDuracion,
  enlaceWhatsapp,
  mensajesWhatsapp,
  precio as formatearPrecio,
} from '@lib/formato';
import {
  borrarReserva,
  codigoDeReserva,
  guardarReserva,
  leerReserva,
  type Reserva,
} from '@lib/reserva';
import { ejemplos, opcionesArea, opcionesPerfil, opcionesUrgencia } from './asistente/pasos';
import './asistente/asistente.scss';

type Via = 'texto' | 'preguntas';

/**
 * Pausa deliberada antes de mostrar el resultado.
 *
 * No es un adorno: comunica que el sistema está trabajando y es exactamente el
 * hueco donde entra la llamada real el día que haya un modelo detrás.
 */
const ESPERA_MS = 900;

interface Respuestas {
  perfil?: PerfilPaciente;
  area?: AreaClinica;
  urgencia?: Urgencia;
}

export default function Asistente() {
  const idBase = useId();
  const [via, setVia] = useState<Via>('texto');

  // Modo texto libre
  const [texto, setTexto] = useState('');
  const [analizando, setAnalizando] = useState(false);
  const [senales, setSenales] = useState<Senal[]>([]);

  // Modo tres preguntas
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Respuestas>({});

  const [consulta, setConsulta] = useState<ConsultaSugerida | null>(null);
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);

  // La reserva se lee después del montaje: en el servidor no hay almacenamiento
  // y leerlo durante el renderizado daría un desajuste de hidratación.
  useEffect(() => {
    setReserva(leerReserva());
  }, []);

  const agendar = useCallback(() => {
    if (!consulta) return;

    const nueva: Reserva = {
      codigo: codigoDeReserva(consulta.especialidad),
      especialidad: consulta.especialidad,
      horario: consulta.horario,
      creada: new Date().toISOString(),
    };

    guardarReserva(nueva);
    setReserva(nueva);
    // `showModal` trae atrapado de foco, cierre con Escape y devolución del
    // foco al origen sin escribir nada de eso a mano.
    dialogo.current?.showModal();
  }, [consulta]);

  const cancelar = useCallback(() => {
    borrarReserva();
    setReserva(null);
  }, []);

  const puedeAnalizar = texto.trim().length >= MINIMO_DE_TEXTO;

  const limpiarResultado = useCallback(() => {
    setConsulta(null);
    setSenales([]);
  }, []);

  const cambiarVia = useCallback(
    (siguiente: Via) => {
      setVia(siguiente);
      setPaso(0);
      setRespuestas({});
      setTexto('');
      limpiarResultado();
    },
    [limpiarResultado],
  );

  const analizar = useCallback(async () => {
    if (!puedeAnalizar || analizando) return;

    setAnalizando(true);
    setConsulta(null);

    const orientacion = await orientar(texto);

    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      setSenales(orientacion.senales);
      setConsulta(consultaPara(orientacion.area, orientacion.perfil, orientacion.urgencia));
      setAnalizando(false);
    }, ESPERA_MS);
  }, [analizando, puedeAnalizar, texto]);

  const responder = useCallback(
    (clave: keyof Respuestas, valor: string) => {
      const siguientes = { ...respuestas, [clave]: valor } as Respuestas;
      setRespuestas(siguientes);

      if (paso < 2) {
        setPaso(paso + 1);
        return;
      }

      // Con las tres respuestas ya no hay nada que interpretar: se arma la
      // consulta directamente.
      if (siguientes.perfil && siguientes.area && siguientes.urgencia) {
        setConsulta(consultaPara(siguientes.area, siguientes.perfil, siguientes.urgencia));
        setPaso(3);
      }
    },
    [paso, respuestas],
  );

  const reiniciar = useCallback(() => {
    setPaso(0);
    setRespuestas({});
    limpiarResultado();
  }, [limpiarResultado]);

  const avance = useMemo(() => Math.round((Math.min(paso, 3) / 3) * 100), [paso]);

  // El patrón de pestañas espera flechas, Inicio y Fin. Sin esto, un lector de
  // pantalla anuncia «pestaña 1 de 2» y las flechas no hacen nada.
  const tecladoDePestanas = useCallback(
    (evento: React.KeyboardEvent<HTMLDivElement>) => {
      const teclas = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!teclas.includes(evento.key)) return;

      evento.preventDefault();
      const destino: Via =
        evento.key === 'Home'
          ? 'texto'
          : evento.key === 'End'
            ? 'preguntas'
            : via === 'texto'
              ? 'preguntas'
              : 'texto';

      cambiarVia(destino);
      document.getElementById(`${idBase}-tab-${destino}`)?.focus();
    },
    [cambiarVia, idBase, via],
  );

  return (
    <div className="asistente">
      <div className="asistente__entrada">
        <div
          className="vias"
          role="tablist"
          aria-label="Cómo prefieres contarnos"
          onKeyDown={tecladoDePestanas}
        >
          <button
            type="button"
            role="tab"
            id={`${idBase}-tab-texto`}
            aria-selected={via === 'texto'}
            aria-controls={`${idBase}-panel-texto`}
            tabIndex={via === 'texto' ? 0 : -1}
            className={`vias__boton ${via === 'texto' ? 'vias__boton--activa' : ''}`}
            onClick={() => cambiarVia('texto')}
          >
            Describir síntomas
          </button>
          <button
            type="button"
            role="tab"
            id={`${idBase}-tab-preguntas`}
            aria-selected={via === 'preguntas'}
            aria-controls={`${idBase}-panel-preguntas`}
            tabIndex={via === 'preguntas' ? 0 : -1}
            className={`vias__boton ${via === 'preguntas' ? 'vias__boton--activa' : ''}`}
            onClick={() => cambiarVia('preguntas')}
          >
            Responder 3 preguntas
          </button>
        </div>

        {via === 'texto' ? (
          <ModoTexto
            idBase={idBase}
            texto={texto}
            onTexto={(valor) => {
              setTexto(valor);
              limpiarResultado();
            }}
            analizando={analizando}
            puedeAnalizar={puedeAnalizar}
            onAnalizar={analizar}
            senales={senales}
          />
        ) : (
          <ModoPreguntas
            idBase={idBase}
            paso={paso}
            avance={avance}
            respuestas={respuestas}
            onResponder={responder}
            onVolver={() => setPaso(Math.max(0, paso - 1))}
            onReiniciar={reiniciar}
          />
        )}
      </div>

      <PanelResultado
        consulta={consulta}
        reserva={reserva}
        onAgendar={agendar}
        onCancelar={cancelar}
      />

      <DialogoConfirmacion refDialogo={dialogo} reserva={reserva} />
    </div>
  );
}

// ---------------------------------------------------------------- modo texto

interface ModoTextoProps {
  idBase: string;
  texto: string;
  onTexto: (valor: string) => void;
  analizando: boolean;
  puedeAnalizar: boolean;
  onAnalizar: () => void;
  senales: Senal[];
}

function ModoTexto({
  idBase,
  texto,
  onTexto,
  analizando,
  puedeAnalizar,
  onAnalizar,
  senales,
}: ModoTextoProps) {
  const idAyuda = `${idBase}-ayuda`;

  return (
    <div
      role="tabpanel"
      id={`${idBase}-panel-texto`}
      aria-labelledby={`${idBase}-tab-texto`}
      className="modo"
    >
      <h3 className="modo__titulo">¿Qué te está pasando?</h3>
      <p className="modo__ayuda" id={idAyuda}>
        Escríbelo como se lo contarías a alguien de confianza. Con una o dos frases alcanza.
      </p>

      <label className="visualmente-oculto" htmlFor={`${idBase}-sintomas`}>
        Describe tus síntomas
      </label>
      <textarea
        id={`${idBase}-sintomas`}
        className="modo__texto"
        value={texto}
        onChange={(evento) => onTexto(evento.target.value)}
        aria-describedby={idAyuda}
        placeholder="Por ejemplo: hace tres días me duele el oído derecho y escucho menos"
        rows={4}
      />

      <p className="modo__etiqueta">O empieza por uno de estos</p>
      <ul className="ejemplos">
        {ejemplos.map((ejemplo) => (
          <li key={ejemplo}>
            <button type="button" className="ejemplos__boton" onClick={() => onTexto(ejemplo)}>
              {ejemplo}
            </button>
          </li>
        ))}
      </ul>

      <div className="modo__acciones">
        <button
          type="button"
          className="boton boton--primario"
          onClick={onAnalizar}
          disabled={!puedeAnalizar || analizando}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M12 3.5l1.9 4.9 4.9 1.9-4.9 1.9L12 17.1l-1.9-4.9L5.2 10.3l4.9-1.9z"
              fill="currentColor"
            />
          </svg>
          Analizar mis síntomas
        </button>
        <p className="modo__nota">No guardamos lo que escribes.</p>
      </div>

      {/* El estado de espera se dice con palabras, no solo con una animación. */}
      {analizando && (
        <p className="cargando" role="status">
          <span className="cargando__rueda" aria-hidden="true" />
          Leyendo tus síntomas…
        </p>
      )}

      {!analizando && senales.length > 0 && (
        <div className="senales">
          <h4 className="senales__titulo">Por qué sugerimos esta consulta</h4>
          <ul className="senales__lista">
            {senales.map((senal) => (
              <li key={senal.etiqueta} className="senales__item">
                {senal.etiqueta}
              </li>
            ))}
          </ul>
          <p className="senales__nota">
            Si no es lo que buscabas, responde las 3 preguntas y lo ajustamos a mano.
          </p>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------ modo preguntas

interface ModoPreguntasProps {
  idBase: string;
  paso: number;
  avance: number;
  respuestas: Respuestas;
  onResponder: (clave: keyof Respuestas, valor: string) => void;
  onVolver: () => void;
  onReiniciar: () => void;
}

function ModoPreguntas({
  idBase,
  paso,
  avance,
  respuestas,
  onResponder,
  onVolver,
  onReiniciar,
}: ModoPreguntasProps) {
  const preguntas = [
    {
      clave: 'perfil' as const,
      titulo: '¿Para quién es la consulta?',
      ayuda: 'Nos ayuda a asignarte el profesional correcto.',
      opciones: opcionesPerfil,
    },
    {
      clave: 'area' as const,
      titulo: '¿Con qué está relacionado?',
      ayuda: 'Elige lo que más se parezca. Después lo afinamos en la consulta.',
      opciones: opcionesArea,
    },
    {
      clave: 'urgencia' as const,
      titulo: '¿Cuándo puedes venir?',
      ayuda: 'Con esto buscamos el primer horario que te sirva.',
      opciones: opcionesUrgencia,
    },
  ];

  const terminado = paso >= preguntas.length;
  const actual = preguntas[Math.min(paso, preguntas.length - 1)]!;

  return (
    <div
      role="tabpanel"
      id={`${idBase}-panel-preguntas`}
      aria-labelledby={`${idBase}-tab-preguntas`}
      className="modo"
    >
      <div className="avance">
        <span className="avance__texto">
          {terminado ? 'Listo' : `Paso ${paso + 1} de ${preguntas.length}`}
        </span>
        <button type="button" className="avance__reiniciar" onClick={onReiniciar}>
          Empezar de nuevo
        </button>
      </div>

      <div
        className="barra"
        role="progressbar"
        aria-valuenow={avance}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Avance de las preguntas"
      >
        <span className="barra__relleno" style={{ inlineSize: `${avance}%` }} />
      </div>

      {terminado ? (
        <div className="resumen">
          <p className="resumen__texto">Ya tienes tu consulta sugerida al lado.</p>
          <button type="button" className="boton boton--secundario" onClick={onReiniciar}>
            Cambiar respuestas
          </button>
        </div>
      ) : (
        <fieldset className="pregunta">
          <legend className="pregunta__titulo">{actual.titulo}</legend>
          <p className="pregunta__ayuda">{actual.ayuda}</p>

          <div className="opciones">
            {actual.opciones.map((opcion) => {
              const id = `${idBase}-${actual.clave}-${opcion.id}`;
              const elegida = respuestas[actual.clave] === opcion.id;

              return (
                // Botones de radio de verdad: la semántica de selección única y
                // el manejo de teclado ya existen en la plataforma.
                <div key={opcion.id} className="opciones__item">
                  <input
                    type="radio"
                    id={id}
                    name={`${idBase}-${actual.clave}`}
                    className="opciones__control"
                    checked={elegida}
                    onChange={() => onResponder(actual.clave, opcion.id)}
                  />
                  <label className="opciones__etiqueta" htmlFor={id}>
                    <span className="opciones__marca" aria-hidden="true" />
                    <span className="opciones__cuerpo">
                      <span className="opciones__nombre">{opcion.etiqueta}</span>
                      <span className="opciones__detalle">{opcion.detalle}</span>
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          {paso > 0 && (
            <button type="button" className="boton boton--secundario" onClick={onVolver}>
              Volver
            </button>
          )}
        </fieldset>
      )}
    </div>
  );
}

// -------------------------------------------------------------- resultado

interface PanelResultadoProps {
  consulta: ConsultaSugerida | null;
  reserva: Reserva | null;
  onAgendar: () => void;
  onCancelar: () => void;
}

function PanelResultado({ consulta, reserva, onAgendar, onCancelar }: PanelResultadoProps) {
  return (
    <div className="resultado">
      {/* La región activa anuncia el resultado a quien usa lector de pantalla,
          que de otro modo no se enteraría de que la mitad derecha cambió. */}
      <div aria-live="polite" className="resultado__vivo">
        {consulta ? `Consulta sugerida: ${consulta.especialidad}` : ''}
      </div>

      {/* La reserva se muestra aunque no haya consulta en pantalla: tras una
          recarga el paciente pierde lo que escribió, pero su cita sigue ahí. */}
      {reserva && (
        <div className="reservada">
          <div className="reservada__cuerpo">
            <p className="reservada__titulo">Cita agendada</p>
            <p className="reservada__detalle">
              {reserva.especialidad} · {reserva.horario}
            </p>
            <p className="reservada__codigo">Código {reserva.codigo}</p>
          </div>
          <button type="button" className="reservada__cancelar" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      )}

      {consulta ? (
        <>
          <div className="resultado__cabecera">
            <div>
              <p className="resultado__eyebrow">Consulta sugerida</p>
              <h3 className="resultado__titulo">{consulta.especialidad}</h3>
              <p className="resultado__detalle">{consulta.detalle}</p>
            </div>
            <span className="resultado__sello" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M3 10h18M8 3v4M16 3v4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>

          <dl className="datos">
            <Dato etiqueta="Primer horario libre" valor={consulta.horario} />
            <Dato etiqueta="Duración estimada" valor={formatearDuracion(consulta.duracion)} />
            <Dato etiqueta="Profesional" valor="[Nombre del profesional]" />
            <Dato etiqueta="Consultorio" valor={consulta.consultorio} />
          </dl>

          <div className="valor">
            <div>
              <p className="valor__etiqueta">Valor de referencia particular</p>
              <p className="valor__nota">Con cobertura básica puede quedar sin costo.</p>
            </div>
            <p className="valor__precio">{formatearPrecio(consulta.precio)}</p>
          </div>

          <div className="resultado__acciones">
            <button
              type="button"
              className="boton boton--primario boton--ancho"
              onClick={onAgendar}
              disabled={reserva !== null}
            >
              {reserva ? 'Ya tienes una cita agendada' : 'Agendar esta cita'}
            </button>

            {/* «Ver otros horarios» no puede ser un botón: sin backend no hay
                agenda que consultar. Pedir otro horario por WhatsApp es lo que
                realmente pasa, y el mensaje ya lleva la especialidad sugerida
                para que en recepción no haya que preguntarla de nuevo. */}
            <a
              className="boton boton--secundario boton--ancho"
              href={enlaceWhatsapp(
                clinica.whatsapp,
                mensajesWhatsapp.otroHorario(consulta.especialidad),
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path
                  d="M4 20l1.2-4A8 8 0 1 1 8 18.8z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
              Pedir otro horario por WhatsApp
            </a>
          </div>
        </>
      ) : reserva ? null : (
        // Estado vacío: mostrar una recomendación antes de que el paciente diga
        // nada haría ver el sistema como decorativo.
        <div className="vacio">
          <svg viewBox="0 0 120 104" width="120" height="104" fill="none" aria-hidden="true">
            <rect x="14" y="14" width="92" height="76" rx="20" fill="var(--c-fondo-alt)" />
            <rect x="30" y="4" width="8" height="20" rx="4" fill="var(--c-borde)" />
            <rect x="82" y="4" width="8" height="20" rx="4" fill="var(--c-borde)" />
            <rect x="14" y="36" width="92" height="2.4" fill="var(--c-borde)" />
            <rect x="30" y="50" width="22" height="14" rx="6" fill="var(--c-fondo)" />
            <rect x="60" y="50" width="22" height="14" rx="6" fill="var(--c-fondo)" />
            <rect x="30" y="70" width="22" height="12" rx="6" fill="var(--c-fondo)" />
            <rect x="60" y="70" width="22" height="12" rx="6" fill="var(--c-fondo)" />
          </svg>
          <p className="vacio__titulo">Aquí aparece tu consulta sugerida</p>
          <p className="vacio__detalle">
            Con especialidad, horario, consultorio y valor de referencia.
          </p>
        </div>
      )}

      <p className="resultado__urgencias">
        Si tienes dolor en el pecho, dificultad para respirar o una urgencia, llama al{' '}
        {clinica.emergencias} en lugar de agendar.
      </p>
    </div>
  );
}

interface DialogoProps {
  refDialogo: React.RefObject<HTMLDialogElement | null>;
  reserva: Reserva | null;
}

function DialogoConfirmacion({ refDialogo, reserva }: DialogoProps) {
  return (
    <dialog className="dialogo" ref={refDialogo} aria-labelledby="dialogo-titulo">
      {reserva && (
        <div className="dialogo__cuerpo">
          <span className="dialogo__sello" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <h3 className="dialogo__titulo" id="dialogo-titulo">
            Tu cita quedó agendada
          </h3>
          <p className="dialogo__detalle">
            {reserva.especialidad} · {reserva.horario}
          </p>
          <p className="dialogo__codigo">Código {reserva.codigo}</p>
          <p className="dialogo__nota">
            Preséntalo en recepción con tu documento y tu credencial de cobertura.
          </p>

          <div className="dialogo__acciones">
            <a
              className="boton boton--primario boton--ancho"
              href={enlaceWhatsapp(
                clinica.whatsapp,
                mensajesWhatsapp.confirmar(reserva.especialidad, reserva.horario),
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Confirmar por WhatsApp
            </a>
            <button
              type="button"
              className="boton boton--secundario boton--ancho"
              onClick={() => refDialogo.current?.close()}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="datos__celda">
      <dt className="datos__etiqueta">{etiqueta}</dt>
      <dd className="datos__valor">{valor}</dd>
    </div>
  );
}

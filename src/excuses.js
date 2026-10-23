const ACCEPT_LINE = 'ya, apaño';

const EXCUSES = [
  'uuuuh perro, justo me llamó mi mamá y eso es prioridad nacional',
  'se me cayó la luz, el medidor hizo click y se fue a la chucha',
  'estoy bañando al gato y el gato no coopera',
  'Windows está actualizando, son como cuatro horas po',
  'tengo lag de tres mil, voy a llegar muerto igual',
  'estoy cocinando completos y si me paro se queman',
  'hay una raid de cuarenta personas y si salgo me funan',
  'se me desconectó el control, está poseído',
  'mañana sí, hoy me quedé viendo un lore de nueve horas',
  'el vecino cortó la fibra, no hay internet ni para el celular',
  'estoy farmeando en Valheim, no me saquen de la pradera',
  'tengo una reunión de cinco minutos que partió hace dos horas',
  'no tengo ese juego instalado y pesa como doscientos gigas',
  'me levanté mareado, el café todavía no hace efecto',
  'estoy ordenando el inventario, es una misión seria',
  'hay neblina en el barrio y no se ve el monitor',
  'se me acabó la bebida y sin bebida no hay apañe',
  'estoy ayudando a un primo con la tarea de matemáticas',
  'el horno tiene algo adentro y si me voy se quema la casa',
  'uuuuh igual iba, pero me dio lata justo ahora',
];

function pickOutcome(rng = Math.random) {
  if (rng() < 0.01) return { accepted: true, line: ACCEPT_LINE };
  const index = Math.min(EXCUSES.length - 1, Math.floor(rng() * EXCUSES.length));
  return { accepted: false, line: EXCUSES[index] };
}

module.exports = {
  ACCEPT_LINE,
  EXCUSES,
  pickOutcome,
};

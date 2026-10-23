const LOSER = 'JAJAJAJA fucking looooser!';
const DEFAULT_FOOTER = 'uuuh sigue participando...';
const SIX = 'un madaaafaking SIIIIIIIX!!';
const TWELVE = 'Un gran poder con lleva una gran responsabilidad, Tachuela Chico';

function rollDie(rng = Math.random) {
  return 1 + Math.floor(rng() * 6);
}

function footerForOne(face) {
  if (face < 4) return LOSER;
  if (face === 6) return SIX;
  return DEFAULT_FOOTER;
}

function footerForTwo(first, second) {
  const total = first + second;
  if (total < 5) return LOSER;
  if (total === 12) return TWELVE;
  return DEFAULT_FOOTER;
}

function capitalize(text) {
  const value = String(text || '');
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

module.exports = {
  LOSER,
  DEFAULT_FOOTER,
  SIX,
  TWELVE,
  rollDie,
  footerForOne,
  footerForTwo,
  capitalize,
};

const fs = require('fs');

const SOURCE_NAMES = new Set(['Wikipedia', 'Steam', 'Prensa']);

function asClause(fact) {
  const trimmed = String(fact || '').trim().replace(/[.?!…]+$/u, '');
  if (!trimmed) return '';
  return `${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
}

function asSentence(fact) {
  const trimmed = String(fact || '').trim().replace(/[.?!…]+$/u, '');
  if (!trimmed) return '';
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}.`;
}

function loadFacts(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`No encuentro los datos de Valheim en ${file}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    throw new Error(`No pude leer los datos de Valheim: ${err.message}`, { cause: err });
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Los datos de Valheim están vacíos.');
  }
  return parsed.map((entry, index) => {
    const fact = entry && typeof entry.fact === 'string' ? entry.fact.trim() : '';
    const name = entry && entry.source && typeof entry.source.name === 'string' ? entry.source.name.trim() : '';
    const url = entry && entry.source && typeof entry.source.url === 'string' ? entry.source.url.trim() : '';
    if (!fact || !SOURCE_NAMES.has(name) || !url.startsWith('https://')) {
      throw new Error(`El dato de Valheim #${index + 1} no tiene frase o fuente válida.`);
    }
    return { fact, source: { name, url } };
  });
}

function pickFact(facts, rng = Math.random) {
  if (!facts.length) throw new Error('No hay datos de Valheim.');
  const index = Math.min(facts.length - 1, Math.floor(rng() * facts.length));
  return facts[index];
}

module.exports = {
  SOURCE_NAMES,
  asClause,
  asSentence,
  loadFacts,
  pickFact,
};

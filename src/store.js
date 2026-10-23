const fs = require('fs');
const path = require('path');

function normalizeGame(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').slice(0, 80);
}

function gameKey(name) {
  return normalizeGame(name).toLocaleLowerCase('es');
}

function emptyData() {
  return { version: 1, refusals: {}, miracles: [], cooldowns: {} };
}

function normalizeData(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('formato inválido');
  }
  const refusals = parsed.refusals && typeof parsed.refusals === 'object' && !Array.isArray(parsed.refusals)
    ? parsed.refusals
    : {};
  return {
    version: 1,
    refusals,
    miracles: Array.isArray(parsed.miracles) ? parsed.miracles : [],
    cooldowns: parsed.cooldowns && typeof parsed.cooldowns === 'object' && !Array.isArray(parsed.cooldowns)
      ? parsed.cooldowns
      : {},
  };
}

function openStore(file) {
  const data = read(file);

  function save() {
    const dir = path.dirname(file);
    fs.mkdirSync(dir, { recursive: true });
    const tmp = path.join(dir, `.${path.basename(file)}.${process.pid}.tmp`);
    fs.writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`);
    fs.renameSync(tmp, file);
  }

  return {
    file,
    addRefusal(name) {
      const display = normalizeGame(name);
      if (!display) throw new Error('Juego vacío');
      const key = gameKey(display);
      const current = data.refusals[key] || { name: display, count: 0 };
      current.count += 1;
      current.name = display;
      data.refusals[key] = current;
      save();
      return { name: current.name, count: current.count };
    },
    ranking() {
      return Object.values(data.refusals)
        .filter((row) => row && typeof row.name === 'string' && typeof row.count === 'number')
        .map((row) => ({ name: row.name, count: row.count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es'));
    },
    recordMiracle(entry) {
      const current = {
        at: entry.at,
        userId: entry.userId || null,
        userName: entry.userName || null,
        game: entry.game ? normalizeGame(entry.game) : null,
      };
      data.miracles.push(current);
      save();
      const previous = data.miracles.length > 1 ? data.miracles[data.miracles.length - 2] : null;
      return { current, previous };
    },
    miracleCount() {
      return data.miracles.length;
    },
    isCoolingDown(key, now = Date.now()) {
      const until = data.cooldowns[key];
      return typeof until === 'number' && until > now;
    },
    setCooldown(key, ms, now = Date.now()) {
      data.cooldowns[key] = now + ms;
      save();
    },
  };
}

function read(file) {
  if (!fs.existsSync(file)) return emptyData();
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (err) {
    throw new Error(`No pude leer ${file}: ${err.message}`, { cause: err });
  }
  try {
    return normalizeData(JSON.parse(raw));
  } catch (err) {
    throw new Error(`No pude leer ${file}: ${err.message}`, { cause: err });
  }
}

module.exports = {
  openStore,
  normalizeGame,
  gameKey,
};

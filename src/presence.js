const { asClause } = require('./facts');

const PLAYING = 0;
const HYPOCRITE_LINE = 'Valvo SÍ apaña… pero solo a Valheim.';

function isValheim(name) {
  return String(name || '').trim().toLocaleLowerCase('es').startsWith('valheim');
}

function collectPlaying(members, { valvoUserId = '', playingType = PLAYING } = {}) {
  const games = new Map();
  let valvoOnValheim = false;

  for (const member of members || []) {
    if (!member || member.bot) continue;
    const seen = new Set();
    for (const activity of member.activities || []) {
      if (!activity || activity.type !== playingType || !activity.name) continue;
      const name = String(activity.name).trim();
      if (!name) continue;
      if (valvoUserId && member.id === valvoUserId && isValheim(name)) valvoOnValheim = true;
      if (isValheim(name)) continue;
      const key = name.toLocaleLowerCase('es');
      if (seen.has(key)) continue;
      seen.add(key);
      const current = games.get(key) || { name, count: 0 };
      current.count += 1;
      games.set(key, current);
    }
  }

  return { games, valvoOnValheim };
}

function decideAlerts({
  members,
  minPlayers,
  valvoUserId = '',
  hypocriteEnabled = false,
  isCoolingDown,
}) {
  const { games, valvoOnValheim } = collectPlaying(members, { valvoUserId });
  const alerts = [];

  for (const game of games.values()) {
    if (game.count < minPlayers) continue;
    const key = game.name.toLocaleLowerCase('es');
    const hypocrite = Boolean(hypocriteEnabled && valvoOnValheim);
    const cooldownKey = hypocrite ? `hypocrite:${key}` : `game:${key}`;
    if (isCoolingDown(cooldownKey)) continue;
    alerts.push({
      game: game.name,
      count: game.count,
      hypocrite,
      cooldownKeys: hypocrite ? [`hypocrite:${key}`, `game:${key}`] : [`game:${key}`],
    });
  }

  alerts.sort((a, b) => b.count - a.count || a.game.localeCompare(b.game, 'es'));
  return alerts;
}

function formatAlert(alert, fact) {
  const head = `Hay ${alert.count} personas jugando ${alert.game}.`;
  if (alert.hypocrite) return `${head} ${HYPOCRITE_LINE}`;
  const clause = asClause(fact.fact);
  return `${head} Mejor juguemos Valheim. ¿Sabían que en Valheim ${clause}? Fuente: ${fact.source.name}.`;
}

module.exports = {
  PLAYING,
  HYPOCRITE_LINE,
  isValheim,
  collectPlaying,
  decideAlerts,
  formatAlert,
};

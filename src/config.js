function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function positiveNumber(value, fallback) {
  if (value === undefined || value === null || String(value).trim() === '') return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function loadConfig(env = process.env) {
  const token = text(env.DISCORD_TOKEN) || text(env.VALVO_TOKEN);
  const valvoUserId = text(env.VALVO_USER_ID);
  const cooldownHours = positiveNumber(env.PRESENCE_COOLDOWN_HOURS, 2);
  const minPlayers = Math.floor(positiveNumber(env.PRESENCE_MIN_PLAYERS, 3));

  return {
    token,
    clientId: text(env.CLIENT_ID),
    guildId: text(env.GUILD_ID),
    valvoUserId,
    hypocriteMode: valvoUserId.length > 0,
    announceChannelId: text(env.ANNOUNCE_CHANNEL_ID),
    cooldownMs: Math.round(cooldownHours * 60 * 60 * 1000),
    minPlayers,
  };
}

function missingStartupConfig(config) {
  const missing = [];
  if (!config.token) missing.push('DISCORD_TOKEN (o el antiguo VALVO_TOKEN)');
  return missing;
}

function missingRegisterConfig(config) {
  const missing = missingStartupConfig(config);
  if (!config.clientId) missing.push('CLIENT_ID');
  if (!config.guildId) missing.push('GUILD_ID');
  return missing;
}

function printMissing(title, missing) {
  console.error(title);
  for (const item of missing) console.error(`- ${item}`);
  console.error('Copia .env.example a .env, completa lo que falta y vuelve a intentar.');
}

module.exports = {
  loadConfig,
  missingStartupConfig,
  missingRegisterConfig,
  printMissing,
};

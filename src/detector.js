const { Events } = require('discord.js');
const { decideAlerts, formatAlert } = require('./presence');
const { pickFact } = require('./facts');

const DEBOUNCE_MS = 8000;

function snapshot(member) {
  return {
    id: member.id,
    bot: Boolean(member.user?.bot),
    activities: (member.presence?.activities || []).map((activity) => ({
      type: activity.type,
      name: activity.name,
    })),
  };
}

function startDetector(client, { config, store, facts }) {
  const timers = new Map();
  let warnedChannel = false;
  let warnedUnusable = false;

  async function post(content) {
    if (!config.announceChannelId) {
      if (!warnedChannel) {
        warnedChannel = true;
        console.warn('Detector de juegos activo, pero falta ANNOUNCE_CHANNEL_ID: no voy a publicar.');
      }
      return false;
    }
    const channel = await client.channels.fetch(config.announceChannelId);
    if (!channel || typeof channel.isTextBased !== 'function' || !channel.isTextBased()) {
      if (!warnedUnusable) {
        warnedUnusable = true;
        console.warn('ANNOUNCE_CHANNEL_ID no es un canal donde se pueda escribir.');
      }
      return false;
    }
    await channel.send({ content, allowedMentions: { parse: [] } });
    return true;
  }

  async function scan(guild) {
    if (!guild) return;
    if (config.guildId && guild.id !== config.guildId) return;
    const members = [...guild.members.cache.values()].map(snapshot);
    const alerts = decideAlerts({
      members,
      minPlayers: config.minPlayers,
      valvoUserId: config.valvoUserId,
      hypocriteEnabled: config.hypocriteMode,
      isCoolingDown: (key) => store.isCoolingDown(`${guild.id}:${key}`),
    });

    for (const alert of alerts) {
      const content = formatAlert(alert, pickFact(facts));
      const sent = await post(content);
      if (!sent) continue;
      for (const key of alert.cooldownKeys) {
        store.setCooldown(`${guild.id}:${key}`, config.cooldownMs);
      }
      console.log(`Aviso de presencia: ${alert.count} en ${alert.game} (hipócrita: ${alert.hypocrite ? 'sí' : 'no'})`);
    }
  }

  function schedule(guild) {
    const existing = timers.get(guild.id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      timers.delete(guild.id);
      scan(guild).catch((err) => console.error('Detector:', err.message));
    }, DEBOUNCE_MS);
    if (typeof timer.unref === 'function') timer.unref();
    timers.set(guild.id, timer);
  }

  client.on(Events.PresenceUpdate, (oldPresence, newPresence) => {
    const guild = newPresence?.guild || oldPresence?.guild;
    if (!guild) return;
    if (config.guildId && guild.id !== config.guildId) return;
    schedule(guild);
  });

  return {
    async ready() {
      const guilds = config.guildId
        ? [await client.guilds.fetch(config.guildId)]
        : [...client.guilds.cache.values()];
      for (const guild of guilds) {
        try {
          await guild.members.fetch({ withPresences: true });
          console.log(`Revisé presencias en ${guild.name}: ${guild.members.cache.size} miembros.`);
          await scan(guild);
        } catch (err) {
          console.error(`No pude revisar presencias en ${guild?.id || 'un servidor'}: ${err.message}`);
        }
      }
    },
  };
}

module.exports = {
  startDetector,
};

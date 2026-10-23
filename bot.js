require('dotenv').config({ quiet: true });

const { Client, GatewayIntentBits, Events, MessageFlags } = require('discord.js');
const { loadConfig, missingStartupConfig, printMissing } = require('./src/config');
const { openStore } = require('./src/store');
const { loadFacts } = require('./src/facts');
const commands = require('./src/commands');
const { startDetector } = require('./src/detector');
const { handleMessage } = require('./src/legacy');
const paths = require('./src/paths');

function main() {
  const config = loadConfig();
  const missing = missingStartupConfig(config);
  if (missing.length) {
    printMissing('Falta configuración para arrancar:', missing);
    process.exit(1);
  }

  let facts;
  try {
    facts = loadFacts(paths.facts);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  let store;
  try {
    store = openStore(paths.db);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMembers,
    ],
    allowedMentions: { parse: ['users'] },
  });

  const byName = new Map(commands.map((command) => [command.data.name, command]));
  const ctx = { store, facts, config, paths };
  const detector = startDetector(client, ctx);

  client.once(Events.ClientReady, async (readyClient) => {
    console.log(`${readyClient.user.tag} está ahora apañando!`);
    if (config.hypocriteMode) console.log('Modo hipócrita activo.');
    else console.log('Sin VALVO_USER_ID: el modo hipócrita queda apagado. El resto funciona.');
    if (!config.announceChannelId) {
      console.log('Sin ANNOUNCE_CHANNEL_ID: el detector de juegos no va a publicar en ningún canal.');
    }
    try {
      await detector.ready();
    } catch (err) {
      console.error('No pude revisar las presencias al partir:', err.message);
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = byName.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, ctx);
    } catch (err) {
      console.error(`Falló /${interaction.commandName}:`, err);
      const payload = {
        content: 'uuuuh, se me cayó el apañe. Intenta de nuevo.',
        flags: MessageFlags.Ephemeral,
      };
      const pending = interaction.replied || interaction.deferred
        ? interaction.followUp(payload)
        : interaction.reply(payload);
      await pending.catch(() => {});
    }
  });

  client.on(Events.MessageCreate, (message) => {
    handleMessage(message, ctx).catch((err) => console.error('Mensaje:', err.message));
  });

  client.on(Events.Error, (err) => {
    console.error('Error del cliente:', err.message);
  });

  client.login(config.token).catch((err) => {
    console.error('No pude conectar con Discord:', err.message || err);
    process.exit(1);
  });
}

main();

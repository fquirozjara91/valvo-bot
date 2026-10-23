const { SlashCommandBuilder, InteractionContextType, ActivityType } = require('discord.js');
const { normalizeGame } = require('../store');

const GAMES = {
  fable: { reply: 'ya po! abriendo su fable', activity: 'Fable' },
  warframe: { reply: 'uuuuuhh su framio, YPAPUY IY UTYKATJEP', activity: 'Warframe' },
  anthem: { reply: 'no hay otra wea? little biiiiitch, ya igual si', activity: 'Anthem' },
  'black desert': {
    reply: 'perro aunque nunca me carrió, ahora es el momento para que lo haga',
    activity: 'Black Desert Online',
  },
  piratas: { reply: 'siempre y cuando me den cofres', activity: 'Sea of Thieves' },
  forza: { reply: 'perro nunca pensé escuchar eso, entrando!', activity: 'Forza Horizon' },
  apb: { reply: 'uuuuuuhh igual, me vestiré de carabibueno para la ocasión', activity: 'APB Reloaded' },
  temtem: { reply: 'uuuuuuhh hay que atraparlos a todos!', activity: 'Temtem' },
};

const DEFAULT_REPLY = 'uuuuuuh pero peeeerro no tengo ese gamesio, lo bajo al toque, pa puro apañar';

function lookup(raw) {
  const key = normalizeGame(raw).toLocaleLowerCase('es').replace(/\?+$/u, '').trim();
  return GAMES[key] || null;
}

async function setPlaying(client, name) {
  if (!name) {
    await client.user.setPresence({ activities: [] });
    return;
  }
  await client.user.setActivity(name, { type: ActivityType.Playing });
}

module.exports = {
  GAMES,
  DEFAULT_REPLY,
  lookup,
  data: new SlashCommandBuilder()
    .setName('juguemos')
    .setDescription('Pídele un juego. Tiene opinión de varios.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) => option
      .setName('juego')
      .setDescription('fable, warframe, anthem, black desert, piratas, forza, apb, temtem…')
      .setRequired(true)
      .setMaxLength(80)),
  async execute(interaction) {
    const raw = interaction.options.getString('juego', true);
    const known = lookup(raw);
    try {
      await setPlaying(interaction.client, known ? known.activity : null);
    } catch (err) {
      console.error('No pude cambiar la actividad:', err.message);
    }
    await interaction.reply({
      content: known ? known.reply : DEFAULT_REPLY,
      allowedMentions: { parse: [] },
    });
  },
};

const {
  SlashCommandBuilder,
  InteractionContextType,
  ActivityType,
  EmbedBuilder,
  AttachmentBuilder,
  MessageFlags,
} = require('discord.js');
const { pickOutcome, ACCEPT_LINE } = require('../excuses');
const { CELEBRATION_COLOR } = require('../message');
const { normalizeGame } = require('../store');

const SAFE = { parse: [] };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apaña')
    .setDescription('Pídele a Valvo que entre a un juego. Casi nunca apaña.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) => option
      .setName('juego')
      .setDescription('El juego al que debería entrar')
      .setRequired(true)
      .setMaxLength(80)),
  async execute(interaction, ctx) {
    const game = normalizeGame(interaction.options.getString('juego', true));
    if (!game) {
      await interaction.reply({ content: '¿A qué juego? Dime uno, po.', flags: MessageFlags.Ephemeral });
      return;
    }

    const outcome = pickOutcome();
    if (outcome.accepted) {
      try {
        await interaction.client.user.setActivity(game, { type: ActivityType.Playing });
      } catch (err) {
        console.error('No pude cambiar la actividad:', err.message);
      }
      const embed = new EmbedBuilder()
        .setColor(CELEBRATION_COLOR)
        .setTitle('YA APAÑÓ')
        .setDescription(`Dijo que sí a **${game}**. Anoten la fecha, que esto no se repite.`)
        .setThumbnail('attachment://valvo-avatar.png')
        .setImage('attachment://celebracion.gif');
      await interaction.reply({
        content: `${ACCEPT_LINE}\n\n🎉🔥⚡ ¡¡¡${game}!!! ⚡🔥🎉\nSi de verdad entra al juego, déjenlo escrito con /milagro.`,
        embeds: [embed],
        files: [
          new AttachmentBuilder(ctx.paths.avatar).setName('valvo-avatar.png'),
          new AttachmentBuilder(ctx.paths.gifTwo).setName('celebracion.gif'),
        ],
        allowedMentions: SAFE,
      });
      return;
    }

    ctx.store.addRefusal(game);
    await interaction.reply({
      content: `**${game}**: ${outcome.line}`,
      allowedMentions: SAFE,
    });
  },
};

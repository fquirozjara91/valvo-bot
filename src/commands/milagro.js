const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require('discord.js');
const { CELEBRATION_COLOR } = require('../message');
const { formatWhen, daysBetween } = require('../format');
const { normalizeGame } = require('../store');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('milagro')
    .setDescription('Anota la fecha en que Valvo sí entró a jugar.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) => option
      .setName('juego')
      .setDescription('A qué entró, si alguien lo vio')
      .setRequired(false)
      .setMaxLength(80)),
  async execute(interaction, ctx) {
    const game = normalizeGame(interaction.options.getString('juego') || '');
    const { current, previous } = ctx.store.recordMiracle({
      at: new Date().toISOString(),
      userId: interaction.user.id,
      userName: interaction.user.globalName || interaction.user.username,
      game: game || null,
    });

    const lines = [
      `Quedó anotado: **${formatWhen(current.at)}**.`,
      game ? `Juego: **${game}**.` : 'Sin juego específico.',
      `Lo registró ${current.userName}.`,
    ];
    if (!previous) {
      lines.push('Es la primera vez que queda escrito. Hay que enmarcarlo.');
    } else {
      const days = daysBetween(previous.at, current.at);
      const when = formatWhen(previous.at);
      lines.push(days === 0
        ? `El anterior fue hoy más temprano: ${when}.`
        : `El anterior fue el ${when} (${days} días antes).`);
    }

    const embed = new EmbedBuilder()
      .setColor(CELEBRATION_COLOR)
      .setTitle('Milagro')
      .setDescription(lines.join('\n'));
    await interaction.reply({ embeds: [embed], allowedMentions: { parse: [] } });
  },
};

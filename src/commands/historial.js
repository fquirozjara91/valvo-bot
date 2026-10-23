const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require('discord.js');
const { COLOR } = require('../message');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('historial')
    .setDescription('Cuántas veces se ha rajado Valvo, juego por juego.')
    .setContexts(InteractionContextType.Guild),
  async execute(interaction, ctx) {
    const rows = ctx.store.ranking();
    const total = rows.reduce((sum, row) => sum + row.count, 0);
    const miracles = ctx.store.miracleCount();
    if (total === 0) {
      await interaction.reply('Todavía no hay excusas anotadas. O nadie le ha pedido que apañe, o —milagro— dijo que sí.');
      return;
    }
    const lines = rows.slice(0, 20).map((row, index) => `${index + 1}. **${row.name}** — ${row.count}`);
    const extra = rows.length > 20 ? `\n…y ${rows.length - 20} juegos más.` : '';
    const embed = new EmbedBuilder()
      .setColor(COLOR)
      .setTitle('Historial de excusas')
      .setDescription(`Van **${total}** negativas.\n\n${lines.join('\n')}${extra}`)
      .setFooter({ text: `Milagros registrados: ${miracles}` });
    await interaction.reply({ embeds: [embed], allowedMentions: { parse: [] } });
  },
};

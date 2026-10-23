const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require('discord.js');
const { COLOR } = require('../message');
const { asSentence, pickFact } = require('../facts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('valheim')
    .setDescription('Un dato de Valheim, con su fuente.')
    .setContexts(InteractionContextType.Guild),
  async execute(interaction, ctx) {
    const fact = pickFact(ctx.facts);
    const embed = new EmbedBuilder()
      .setColor(COLOR)
      .setTitle('Dato de Valheim')
      .setDescription(asSentence(fact.fact))
      .addFields({ name: 'Fuente', value: `[${fact.source.name}](${fact.source.url})` });
    await interaction.reply({ embeds: [embed] });
  },
};

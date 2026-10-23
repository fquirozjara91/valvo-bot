const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const { commandsEmbed } = require('../message');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ayuda')
    .setDescription('Lista de comandos y para qué sirve este bot.')
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    await interaction.reply({ embeds: [commandsEmbed()] });
  },
};

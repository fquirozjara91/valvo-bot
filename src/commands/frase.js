const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const { truthPayload } = require('../message');

const LINES = {
  apanai: 'demás po perro!',
  aburrido: 'que quiere jugar? yo apaño a lo que sea',
  basta: 'lo siento, tenía muchas ganas de apañar',
  carabineros: 'A.C.A.B.',
  botones: 'odio los botones',
  estallido: 'puta la verda es que está la cagá en todo el pais, piece of shiiiiiet faaaaacking biiiiitchh :notes: :notes:',
  'no-apana': 'uuuuh que laaaaaata ese tipo',
};

module.exports = {
  LINES,
  data: new SlashCommandBuilder()
    .setName('frase')
    .setDescription('Las frases de toda la vida.')
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) => option
      .setName('cual')
      .setDescription('Cuál quieres escuchar')
      .setRequired(true)
      .addChoices(
        { name: 'apañai?', value: 'apanai' },
        { name: 'estoy aburrido', value: 'aburrido' },
        { name: 'deja de apañar', value: 'basta' },
        { name: 'eres un bot?', value: 'bot' },
        { name: '¿qué opinas de los carabineros?', value: 'carabineros' },
        { name: '¿qué opinas de los botones?', value: 'botones' },
        { name: '¿qué opinas del estallido social?', value: 'estallido' },
        { name: '¿qué opinas del valvo que no apaña?', value: 'no-apana' },
      )),
  async execute(interaction, ctx) {
    const which = interaction.options.getString('cual', true);
    if (which === 'basta') {
      try {
        await interaction.client.user.setPresence({ activities: [] });
      } catch (err) {
        console.error('No pude limpiar la actividad:', err.message);
      }
    }
    if (which === 'bot') {
      await interaction.reply({
        content: `${interaction.user} :incoming_envelope: acompañame, te contaré una triste historia`,
        allowedMentions: { users: [interaction.user.id] },
      });
      try {
        await interaction.user.send(truthPayload(ctx.paths.avatar));
      } catch {
        await interaction.followUp(truthPayload(ctx.paths.avatar));
      }
      return;
    }
    await interaction.reply(LINES[which] || 'uuuuh, esa no me la sé');
  },
};

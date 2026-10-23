const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { COLOR, commandsEmbed } = require('./message');

const SUGGESTIONS = 'https://github.com/fquirozjara91/valvo-bot/issues';

async function handleMessage(message, ctx) {
  if (!message.author || message.author.bot || message.system) return;
  const content = message.content || '';

  if (ctx.config.valvoUserId
    && message.author.id === ctx.config.valvoUserId
    && content.trim().toLocaleLowerCase('es').startsWith('valvo')) {
    await message.channel.send({
      content: 'espera!... quien eres tu!?!?!?',
      files: [new AttachmentBuilder(ctx.paths.spider)],
    });
  }

  if (typeof message.channel.isDMBased === 'function' && message.channel.isDMBased() && content.startsWith('!')) {
    const args = content.slice(1).trim().toLocaleLowerCase('es');
    if (args === 'comandos') {
      await message.author.send({ embeds: [commandsEmbed()] });
      return;
    }
    if (args === 'sugerencias') {
      const embed = new EmbedBuilder()
        .setColor(COLOR)
        .addFields({
          name: 'Sugerencias',
          value: `si quieres agregar nuevas funciones puedes dejar tu sugerencia en el siguiente link: [Click Aquí](${SUGGESTIONS})`,
        });
      await message.author.send({ embeds: [embed] });
    }
  }
}

module.exports = {
  handleMessage,
  SUGGESTIONS,
};

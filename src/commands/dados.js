const { SlashCommandBuilder, InteractionContextType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { COLOR } = require('../message');
const { rollDie, footerForOne, footerForTwo, capitalize } = require('../dice');

const DELAY_MS = 4000;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dados')
    .setDescription('Tira uno o dos dados, como en los viejos tiempos.')
    .setContexts(InteractionContextType.Guild)
    .addIntegerOption((option) => option
      .setName('cantidad')
      .setDescription('Cuántos dados')
      .setRequired(true)
      .addChoices(
        { name: '1 dado', value: 1 },
        { name: '2 dados', value: 2 },
      ))
    .addStringOption((option) => option
      .setName('descripcion')
      .setDescription('Por qué se tira')
      .setRequired(false)
      .setMaxLength(80)),
  async execute(interaction, ctx) {
    const count = interaction.options.getInteger('cantidad', true);
    const description = capitalize(interaction.options.getString('descripcion') || 'Tiro simple');
    const player = interaction.member?.displayName || interaction.user.username;
    const gif = count === 1 ? ctx.paths.gifOne : ctx.paths.gifTwo;

    await interaction.reply({
      content: count === 1 ? '***1 daditooo!***' : '***2 daditooos!***',
      files: [new AttachmentBuilder(gif)],
    });

    await wait(DELAY_MS);

    const first = rollDie();
    const second = count === 2 ? rollDie() : null;
    const total = second === null ? first : first + second;
    const footer = second === null ? footerForOne(first) : footerForTwo(first, second);
    const files = second === null
      ? [new AttachmentBuilder(ctx.paths.die(first)).setName('dado.png')]
      : [
        new AttachmentBuilder(ctx.paths.die(first)).setName('dado-a.png'),
        new AttachmentBuilder(ctx.paths.die(second)).setName('dado-b.png'),
      ];
    const embed = new EmbedBuilder()
      .setColor(COLOR)
      .setTitle('Valvo-Resultado')
      .setDescription(description)
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields({ name: 'Jugador', value: `${player} sacó ${total}` })
      .setImage(second === null ? 'attachment://dado.png' : 'attachment://dado-a.png')
      .setFooter({ text: footer });

    await interaction.editReply({
      content: null,
      embeds: [embed],
      files,
      attachments: [],
    });
  },
};

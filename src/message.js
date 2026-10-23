const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

const COLOR = 0x860202;
const CELEBRATION_COLOR = 0xffd000;

const TRUTH = 'la verdad es que soy un bot creado en el año 2020 para recordar los dias en los que valvo apañaba, la fuerte necesidad de esperar un yo te apaño de valvo le dio vida a este bot';

function truthEmbed() {
  return new EmbedBuilder()
    .setColor(COLOR)
    .setThumbnail('attachment://valvo-avatar.png')
    .addFields(
      { name: 'La verdad', value: TRUTH },
      { name: 'ayuda', value: '`/ayuda` `/apaña` `/frase` `/juguemos` `/dados`' },
    );
}

function truthPayload(avatarPath) {
  return {
    embeds: [truthEmbed()],
    files: [new AttachmentBuilder(avatarPath).setName('valvo-avatar.png')],
  };
}

function commandsEmbed() {
  return new EmbedBuilder()
    .setColor(COLOR)
    .setTitle('Valvo apaña (o no)')
    .setDescription('El prefijo de antes era `valvo`. Ahora son comandos de barra, en el servidor.')
    .addFields(
      { name: '/apaña', value: 'Pídele que entre a un juego. Casi siempre tiene una excusa.' },
      { name: '/historial', value: 'Cuántas veces se ha rajado, juego por juego.' },
      { name: '/valheim', value: 'Un dato de Valheim, con fuente.' },
      { name: '/milagro', value: 'Anota el día en que de verdad entró.' },
      { name: '/juguemos', value: 'Las respuestas de siempre: fable, warframe, anthem, piratas…' },
      { name: '/dados', value: 'Uno o dos daditos.' },
      { name: '/frase', value: 'apañai, aburrido, botones, carabineros y el resto del repertorio.' },
      { name: '/ayuda', value: 'Esta lista.' },
      {
        name: 'Por mensaje directo',
        value: '`!comandos` y `!sugerencias` siguen vivos.',
      },
    );
}

module.exports = {
  COLOR,
  CELEBRATION_COLOR,
  TRUTH,
  truthEmbed,
  truthPayload,
  commandsEmbed,
};

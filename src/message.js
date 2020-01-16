const { RichEmbed } = require('discord.js');

exports.createEmbedMessage = (author = undefined, fields = undefined, thumbNail = undefined, image = undefined, footer = undefined, link = undefined) => {
    let embed = new RichEmbed();

    if (undefined != author) {
        embed.setAuthor(author);
    }

    if (undefined != fields && fields.length > 0) {
        for (const field of fields) {
            embed.addField(field.name, " " + field.value)
        }
    }

    if (undefined != image) {
        embed.setImage(image);
    }

    if (undefined != thumbNail) {
        embed.attachFile(thumbNail);
        embed.setThumbnail('attachment://valvo-avatar.png');
    }

    if (undefined != footer) {
        embed.setFooter(footer.text, footer.icon);
    }

    if (undefined != link) {
        embed.addField(link.name, link.value);
    }
    embed.setColor(0x860202);

    return embed;
}

exports.sendMentionMessage = (text, message) => {
    message.channel.send(`${message.author.toString()} ` + text);
}

exports.sendEmbedDado = (descripcion = undefined, avatar = undefined, author = undefined, random, footer= undefined) => {
    let strCapitalize = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);
    let embed = new RichEmbed()
        .setTitle('Valvo-Resultado')
        .setDescription(strCapitalize)
        .setThumbnail(avatar)
        .addField('Jugador', `${author} sacó ` + random)
        .attachFiles([`./images/1dado/${random}.png`])
        .setImage(`attachment://${random}.png`)
        .setFooter(footer);
        return embed
}

exports.laVerdad = () => {
    let verdad = [{
        name: "La verdad",
        value: "la verdad es que soy un bot creado en el año 2020 para recordar los dias en los que valvo apañaba, la fuerte necesidad de esperar un yo te apaño de valvo le dio vida a este bot"
    },
    {
        name: "ayuda",
        value: "`!comandos` `!sugerencias`"
    }
    ]
    return verdad;
}
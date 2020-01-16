const { RichEmbed } = require('discord.js');

exports.createEmbedMessage = (author = undefined, fields = undefined, thumbNail = undefined, footer = undefined, link = undefined) => {
    let embed = new RichEmbed();

    if (undefined != author) {
        embed.setAuthor(author);
    }

    if (undefined != fields && fields.length > 0) {
        for (const field of fields) {
            embed.addField(field.name, " " + field.value)
        }
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

exports.sendNormalMessage = (text, message) => {
    message.channel.send(text);
};

exports.sendEmbedMessage = (embed, message) => {
    message.channel.send(embed);
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
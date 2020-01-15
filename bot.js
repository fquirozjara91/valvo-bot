var Discord = require('discord.js');
const { createEmbedMessage, laVerdad, sendMentionMessage, sendNormalMessage, sendEmbedMessage } = require('./src/message');

var bot = new Discord.Client();
const attachment = new Discord.Attachment('./images/valvo-avatar.png', 'valvo-avatar.png');
var auth = require('./auth.json');
bot.login(auth.token);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', (message) => {

    if (message.channel.type == 'dm' && message.author.tag != bot.user.tag) {

        if (message.content.startsWith('!')) {
            let args = message.content.substring(1);
            console.log(args);
            switch (args) {
                case 'comandos':
                    let comandos = [{
                            name: "prefijo",
                            value: "valvo"
                        },
                        {
                            name: "apañes",
                            value: "`apañai?` `estoy aburrido` `eres un bot?`"
                        },
                        {
                            name: "jugemos",
                            value: "`fable` `warframe` `anthem` `piratas` `apb` `forza` `black desert`"
                        }
                    ]
                    message.author.send(createEmbedMessage(undefined, comandos, attachment, undefined));
                    break;
            }
        }
    }

    // frases de apañe
    if (message.content.startsWith('valvo') && message.channel.type != 'dm') {
        let args = message.content.substring(6);
        switch (args) {
            case 'apañai?':
                message.channel.send('demás po perro!');
                break;
            case 'estoy aburrido':
                message.channel.send('que quiere jugar? yo apaño a lo que sea');
                break;
            case 'ayuda':
                message.author.send(`uuuh que pasa ${message.author.username}? a que quiere que le apañe?`);
                break;
            case 'deja de apañar':
                message.channel.send('lo siento, tenía muchas ganas de apañar');
                bot.user.setActivity(null);
                break;
            case 'eres un bot?':
                let verdad = laVerdad();
                sendMentionMessage(':incoming_envelope: acompañame, te contaré una triste historia', message);
                message.author.send(createEmbedMessage(undefined, verdad, attachment, undefined));
                break;
        }
    }
    // frases jugemos
    if (message.content.startsWith('valvo jugemos')) {
        let args = message.content.substring(14);
        console.log(args);
        switch (args) {
            case 'fable?':
                message.channel.send('ya po! abriendo su fable');
                bot.user.setActivity('Fable', { type: 'Playing' })
                    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                    .catch(console.error);
                break;
            case 'warframe?':
                message.channel.send('uuuuuhh su framio, YPAPUY IY UTYKATJEP');
                bot.user.setActivity('Warframe', { type: 'Playing' })
                    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                    .catch(console.error);
                break;
            case 'anthem?':
                message.channel.send('no hay otra wea? little biiiiitch, ya igual si');
                bot.user.setActivity('Anthem', { type: 'Playing' })
                    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                    .catch(console.error);
                break;
            case 'black desert?':
                message.channel.send('perro aunque nunca me carrió, ahora es el momento para que lo haga');
                bot.user.setActivity('Black Desert Online', { type: 'Playing' })
                    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                    .catch(console.error);
                break;
            case 'piratas?':
                message.channel.send('siempre y cuando me den cofres');
                bot.user.setActivity('Sea of Thieves', { type: 'Playing' })
                    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                    .catch(console.error);
                break;
            case 'forza?':
                message.channel.send('perro nunca pensé escuchar eso, entrando')
                bot.user.setActivity('Forza Horizon', { type: 'Playing' })
                    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                    .catch(console.error);
                break;
            case 'apb?':
                message.channel.send('uuuuuuhh igual, me vestiré de carabibueno para la ocasión')
                bot.user.setActivity('APB Reloaded', { type: 'Playing' })
                    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                    .catch(console.error);
                break;
            default:
                message.channel.send('uuuuuuh pero peeeerro no tengo ese gamesio, lo bajo al toque, pa puro apañar');
                bot.user.setActivity(null);
                break;
        }

    }

});
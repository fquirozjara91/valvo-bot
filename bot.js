var Discord = require('discord.js');
const { createEmbedMessage, laVerdad, sendMentionMessage, sendNormalMessage, sendEmbedMessage } = require('./src/message');

var bot = new Discord.Client();
const attachment = new Discord.Attachment('./images/valvo-avatar.png', 'valvo-avatar.png');
const valvoCeption = new Discord.Attachment('./images/spider-valvo.jpg');

bot.login(process.env.VALVO_TOKEN);

bot.on('ready', () => {
    console.log(`${bot.user.tag} está ahora apañando!`);
});

bot.on('message', (message) => {

    if (message.author.tag == 'Valvoywea#6264') {
        message.channel.send("espera!... quien eres tu!?!?!?", { file: valvoCeption });
    } else {
        if (message.channel.type == 'dm' && message.author.tag != bot.user.tag) {
            if (message.content.startsWith('!')) {
                let args = message.content.substring(1).toLocaleUpperCase();
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
                            name: "juguemos",
                            value: "`fable` `warframe` `anthem` `piratas` `apb` `forza` `black desert`"
                        },
                        {
                            name: "sugerencias",
                            value: "si quieres agregar alguna funcion puedes hacerlo en el siguiente link seccion Issues `eres un bot?`"
                        }];
                        message.author.send(createEmbedMessage(undefined, comandos, attachment, undefined));
                        break;
                }
            }
        }

        // frases de apañe
        if (message.content.startsWith('valvo') && message.channel.type != 'dm') {
            let args = message.content.substring(6).toLocaleUpperCase();
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

        // valvo que opinas de ?
                case 'que opinas de los carabineros':
                    message.channel.send('A.C.A.B. :pacolumazo: :pacolumazo: :pacolumazo:');
                    break;
                case 'que opinas de los botones?':
                    message.channel.send('odio los botones');
                    break;
                case 'que opinas del estallido social?':
                    message.channel.send('puta la verda es que está la cagá en todo el pais, piece of shiiiiiet faaaaacking biiiiitchh :notes: :notes:')
                    break;
                case 'que opinas del valvo que no apaña?':
                    message.channel.send('uuuuh que laaaaaata ese wn');
                    break;
            }
        }
        // frases jugemos
        if (message.content.startsWith('valvo juguemos' && message.channel.type != 'dm')) {
            let args = message.content.substring(15).toLocaleUpperCase();
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
    }



});
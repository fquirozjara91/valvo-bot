var Discord = require('discord.js');
const { createEmbedMessage, laVerdad, sendMentionMessage, sendEmbedDado, sendEmbed2Dado, sendImgEmbed } = require('./src/message');

var bot = new Discord.Client();
const attachment = new Discord.Attachment('./images/valvo-avatar.png', 'valvo-avatar.png');
const valvoCeption = new Discord.Attachment('./images/spider-valvo.jpg');
const gif1Dados = new Discord.Attachment('./images/gif/1dado.gif');
const ytdl = require('ytdl-core-discord');


bot.login(process.env.VALVO_TOKEN);

bot.on('ready', () => {
    console.log(`${bot.user.tag} está ahora apañando!`);
});

bot.on('message', (message) => {

    // valvoception
    if (message.author.tag == 'Valvoywea#6264' && message.content.startsWith('valvo')) {
        message.channel.send("espera!... quien eres tu!?!?!?", { file: valvoCeption });
    }

    // mensajes privados
    if (message.channel.type == 'dm' && message.author.tag != bot.user.tag) {
        if (message.content.startsWith('!')) {
            let args = message.content.substring(1);
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
                        }
                    ];
                    message.author.send(createEmbedMessage(undefined, comandos, attachment));
                    break;
                case 'sugerencias':
                    message.author.send(createEmbedMessage(undefined, undefined, undefined, undefined, undefined, { name: 'Sugerencias', value: 'si quieres agregar nuevas funciones puedes dejar tu sugerencia en el siguiente link: [Click Aquí](https://github.com/fquirozjara91/valvo-bot/issues)' }));
            }
        }
    }


    if (message.content.startsWith('valvo') && message.channel.type != 'dm') {
        let args = message.content.substring(6);
        let descripcion = 'Tiro simple';
        let footer = 'uuuh sigue participando...';

        //dame suerte

        if (args.length >= 6 && message.content.substring(6, 17) == 'dame suerte') {

            function play(connection) {
                connection.play(ytdl('https://www.youtube.com/watch?v=qHTfVI-xN1Y', { type: 'opus' }));
            }
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return message.channel.send('pero peeeerro si quiere suerte tiene que entrar en un canal');
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return message.channel.send('uuuuh no tengo permisos para entrar');
            }

            try {
                var connection = voiceChannel.join().then((res) => {
                    //console.log(res);
                    play(res);
                });
            } catch (err) {
                console.log(err);
                return message.channel.send(err);
            }
        }


        // valvo-dados
        if (args.length >= 6 && message.content.substring(6, 12) == '1 dado') {
            if (message.content.substring(17).length > 0) {
                descripcion = message.content.substring(18);
            }

            message.channel.send("***1 daditooo!***", { file: gif1Dados }).then((msg) => {
                msg.delete(4000).then(() => {
                    let dado = (Math.round(Math.random() * (6 - 1) + 1)).toString();
                    if (dado < 4) {
                        footer = 'JAJAJAJA fucking looooser!';
                    } else if (dado == 6) {
                        footer = 'un madaaafaking SIIIIIIIX!!';
                    }
                    message.channel.send(sendEmbedDado(dado, descripcion, message.author.avatarURL, message.author.toString(), footer));
                });
            });
        }
        if (args.length >= 6 && message.content.substring(6, 13) == '2 dados') {
            if (message.content.substring(18).length > 0) {
                descripcion = message.content.substring(18);
            }
            message.channel.send("***2 daditooos!***", { file: gif1Dados }).then((msg) => {
                msg.delete(4000).then(() => {
                    let dado1 = (Math.round(Math.random() * (6 - 1) + 1)).toString();
                    let dado2 = (Math.round(Math.random() * (6 - 1) + 1)).toString();
                    if (+dado1 + +dado2 < 5) {
                        footer = 'JAJAJAJA fucking looooser!';
                    } else if (+dado1 + +dado2 == 12) {
                        footer = 'Un gran poder con lleva una gran responsabilidad, Tachuela Chico';
                    }
                    message.channel.send(sendImgEmbed(dado1)).then(() => {
                        message.channel.send(sendImgEmbed(dado2)).then(() => {
                            message.channel.send(sendEmbed2Dado(dado1, dado2, descripcion, message.author.avatarURL, message.author.toString(), footer));
                        });
                    });
                });
            });
        }

        // frases de apañe
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
            case 'que opinas de los carabineros?':
                message.channel.send('A.C.A.B.');
                break;
            case 'que opinas de los botones?':
                message.channel.send('odio los botones');
                break;
            case 'que opinas del estallido social?':
                message.channel.send('puta la verda es que está la cagá en todo el pais, piece of shiiiiiet faaaaacking biiiiitchh :notes: :notes:');
                break;
            case 'que opinas del valvo que no apaña?':
                message.channel.send('uuuuh que laaaaaata ese tipo');
                break;
        }
    }

    // frases jugemos
    if (message.content.startsWith('valvo juguemos') && message.channel.type != 'dm') {
        let juguemos = message.content.substring(15);
        console.log(juguemos);
        switch (juguemos) {
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
                message.channel.send('perro nunca pensé escuchar eso, entrando!');
                bot.user.setActivity('Forza Horizon', { type: 'Playing' })
                    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                    .catch(console.error);
                break;
            case 'apb?':
                message.channel.send('uuuuuuhh igual, me vestiré de carabibueno para la ocasión');
                bot.user.setActivity('APB Reloaded', { type: 'Playing' })
                    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                    .catch(console.error);
                break;

            case 'temtem?':
                message.channel.send('uuuuuuhh hay que atraparlos a todos!');
                bot.user.setActivity('Temtem', { type: 'Playing' })
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
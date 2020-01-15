var Discord = require('discord.js');
var bot = new Discord.Client();
var auth = require('./auth.json');
bot.login(auth.token);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', (message) => {
    if (message.content.startsWith('valvo')) {
        var args = message.content.substring(6);
        switch(args) {
            case 'apañai?':
                message.channel.send('demás po perro!');
            break;
            case 'estoy aburrido':
                message.channel.send('que quiere jugar? yo apaño a lo que sea');
            break;
            case 'jugemos fable?':
                message.channel.send('ya po! abriendo su fable');
                bot.user.setActivity('Fable', { type: 'Playing' })
                .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                .catch(console.error);
            break; 
            case 'jugemos warframe?':
                message.channel.send('uuuuuhh su framio, YPAPUY IY UTYKATJEP');
                bot.user.setActivity('Warframe', { type: 'Playing' })
                .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                .catch(console.error);
            break; 
            case 'jugemos anthem?':
                message.channel.send('no hay otra wea? little biiiiitch, ya igual si');
                bot.user.setActivity('Anthem', { type: 'Playing' })
                .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                .catch(console.error);
            break; 
            case 'jugemos black desert?':
                message.channel.send('perro aunque nunca me carrió, ahora es el momento para que lo haga');
                bot.user.setActivity('Black Desert Online', { type: 'Playing' })
                .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                .catch(console.error);
            break; 
            case 'jugemos piratas?':
                message.channel.send('siempre y cuando me den cofres');
                bot.user.setActivity('Sea of Thieves', { type: 'Playing' })
                .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                .catch(console.error);
            break; 
            case 'jugemos forza?':
                message.channel.send('perro nunca pensé escuchar eso, entrando')
                bot.user.setActivity('Forza Horizon', { type: 'Playing' })
                .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                .catch(console.error);
            break; 
            case 'jugemos apb?':
                message.channel.send('uuuuuuhh igual, me vestiré de carabibueno para la ocasión')
                bot.user.setActivity('APB Reloaded', { type: 'Playing' })
                .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
                .catch(console.error);
            break;
            case 'deja de apañar':
                message.channel.send('lo siento, tenía muchas ganas de apañar');
                bot.user.setActivity(null);
            break;
         }
    }
});
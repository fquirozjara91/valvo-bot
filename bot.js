var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {

    if (message.substring(0, 5) == 'valvo') {
        var args = message.substring(6);
        switch(args) {
            case 'apañai?':
                bot.sendMessage({
                    to: channelID,
                    message: 'demás po perro!'
                });
            break;
            case 'estoy aburrido':
                bot.sendMessage({
                    to: channelID,
                    message:  'que quiere jugar? yo apaño a lo que sea'
                });
            break; 
         }
     }
});
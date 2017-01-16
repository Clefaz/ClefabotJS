const commando = require('discord.js-commando');
const bot = new commando.Client();

bot.registry.registerGroup('random', 'Random');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

bot.login('MjcwNTY3Mzk4NjM2MTI2MjA4.C15xLg.LRHPysZ2cSQpWj3LIL2Wtddt7H8');


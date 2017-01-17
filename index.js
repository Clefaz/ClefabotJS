const commando = require('discord.js-commando');
const bot = new commando.Client();

bot.registry.registerGroup('random', 'Random');
bot.registry.registerGroup('test', 'Test');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

bot.login('MjcwODM4NTg4MjIzMTI3NTUy.C19tmg.-I1elK8Z6k8A7xTeSXtNB7V5gKk',console.log("logged"));


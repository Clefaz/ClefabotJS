const Discord = require("discord.js");
var mongoose = require('./mongoose.js');

const client = new Discord.Client();

const PREFIX_CMD = '!';
const FUNCTIONS = require('./functions');


client.on('ready', function() {
    console.log('Logged in as \"' + client.user.username + '\"');
});

client.on('message', function(msg) {
    var args = msg.content.split(' ');
    if(args[0].substr(0, 1) == PREFIX_CMD) {
        switch(args[0].substr(1)) {
            case 'ping':
                return FUNCTIONS.ping(msg);
            case 'help':
                return FUNCTIONS.help(msg);
            case 'say':
                return FUNCTIONS.say(msg, args);
            case 'dbcheck' :
                return FUNCTIONS.dbcheck(msg);
            case 'dbinit' :
                return FUNCTIONS.dbinit(msg);
            case 'invit' :
                return FUNCTIONS.invit(msg);
            default:
                return msg.reply('Commande Invalide');

        }
    }

});



client.login('MjcwODM4NTg4MjIzMTI3NTUy.C2D5Ww.lPi1isP-nFOAkD2HUp3brzg7y8Y');
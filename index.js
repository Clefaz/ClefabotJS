const Discord = require("discord.js");
const mongoose = require("mongoose");
const client = new Discord.Client();
const PREFIX_CMD = '!';
const FUNCTIONS = require('./functions');


client.on('ready', function() {
    console.log('Logged in as \"'+client.user.username + '\"');
    mongoose.connect('mongodb://localhost:27017/test');

    var schema = new ({ name: String });
    var Page = mongoose.model('Page', schema);
    var p = new Page({ name: 'mongodb.org' });
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
            case 'dbconnect' :
                return FUNCTIONS.dbconnect(msg, mongoose);
            default:
                return msg.reply('Commande non reconnue');

        }
    }

});



client.login('MjcwODM4NTg4MjIzMTI3NTUy.C2D5Ww.lPi1isP-nFOAkD2HUp3brzg7y8Y');
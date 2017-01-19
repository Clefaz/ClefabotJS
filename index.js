const Discord = require("discord.js");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bot = new Discord.Client();

const FUNCTIONS = {};

///////////////////////////////////Schema de quotes
CitationSchema = new mongoose.Schema({
author : String, // le mec qui a écrit ça (son nom)
submitted_by : String, // le mec qui a envoyé la citation (son nom)
quote : String // la citation
});

///////////////////////////////////Connexion a la base de données
if (mongoose.connection.readyState == 0){
    mongoose.connect('mongodb://localhost:27017/test', function (err) {
        if(err)
            console.log('erreur de connection a la base de données');
        else
            console.log('connecté a la base de données');
    });
}

function concatenateArgs(args) {
    var t = '';
    for(var i = 0; i < args.length; i++) {
        t += args;
        if(i + 1 != args.length) {
            t += ' ';
        }
    }
    return t;
}

///////////////////////////////////Commandes
FUNCTIONS.ping = function(msg) {
    msg.reply('pong !');
};

FUNCTIONS.help = function(msg) {

    msg.reply('je t\'aide !');
};

FUNCTIONS.say = function(msg, args) {
    var string = concatenateArgs(args);
};

FUNCTIONS.dbcheck = function(msg){
    var status = mongoose.connection.readyState==1?'online':'offline';
    msg.reply('`Database state: ' + status + '`');
};

FUNCTIONS.quote = function (msg) {
    mongoose.model('Citations', CitationSchema);

    var quote = msg.content.split('\"');
    if (quote.length != 3) {
        msg.reply('quote invalide');
        return;
    }

    var tmp = new mongoose.models.Citations();

    var auteur = quote[2].split('-');
    tmp.author = auteur[auteur.length - 1];
    tmp.submitted_by = msg.author.username;
    tmp.quote = quote[1];

    console.log(tmp);

    tmp.save(function (err) {
        if (err){
            console.log('erreur sauvegarde', err);
            msg.channel.sendMessage('```MARKDOWN\n\#Erreur de sauvegarde\n' +
                                    'Attention a ! ```');
        }else {
            console.log('citation enregistrée');
            msg.channel.sendMessage('```MARKDOWN\n\#Derniere quote enregistrée dans la base de données:\n' +
                'quote = ' + tmp.quote + '\n' +
                'auteur = ' + tmp.author + '\n' +
                'envoyé par = ' + tmp.submitted_by + '```');
        }
    });
}

FUNCTIONS.invit = function (msg) {
    bot.createInvite(msg.channel,{maxAge:1800,maxUses:1});
};
//

///////////////////////////////////Events
bot.on('ready', function() {
    console.log('Logged in as \"' + bot.user.username + '\"');
});

bot.on('message', function(msg) {
    var args = msg.content.split(' ');
    if(args[0].substr(0, 1) == '!') {
        switch(args[0].substr(1)) {
            case 'ping':
                return FUNCTIONS.ping(msg);
            case 'help':
                return FUNCTIONS.help(msg);
            case 'say':
                return FUNCTIONS.say(msg, args);
            case 'dbcheck' :
                return FUNCTIONS.dbcheck(msg);
            case 'invit' :
                return FUNCTIONS.invit(msg);
            default:
                return msg.reply('Commande Invalide');
        }
    }
    if(args[0].substr(0, 1) == '\"' && msg.channel.name === 'quote')
        return FUNCTIONS.quote(msg, args);
});


///////////////////////////////////Connexion au serveur
bot.login('MjcwODM4NTg4MjIzMTI3NTUy.C2D5Ww.lPi1isP-nFOAkD2HUp3brzg7y8Y');
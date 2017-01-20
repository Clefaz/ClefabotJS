const Discord = require("discord.js");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bot = new Discord.Client();

const FUNCTIONS = {};

///////////////////////////////////Schema de quotes
QuoteSchema = new mongoose.Schema({
    author : String, // le mec qui a écrit ça (son nom)
    submitted_by : String, // le mec qui a envoyé la citation (son nom)
    quote : String, // la citation
});

///////////////////////////////////Connexion a la base de données
if (mongoose.connection.readyState == 0){
    mongoose.connect('mongodb://localhost:27017/clefabot', function (err) {
        if(err)
            console.log('erreur de connection a la base de données');
        else
            console.log('connecté a la base de données');
    });
}

///////////////////////////////////Commandes
FUNCTIONS.ping = function(msg) {
    msg.reply('pong ! #joke');
};    //DONE

FUNCTIONS.help = function(msg) {
    msg.author.sendMessage('help sent');
    msg.reply('je viens de t\'envoyer un MP avec de l\'aide');
};   //////TODO Completer l'aide

FUNCTIONS.dbcheck = function(msg){
    var status = mongoose.connection.readyState==1?'online':'offline /!\\ Contactez Clefaz.';
    msg.channel.sendMessage('`Etat de la base de données : ' + status + '`');
};  //DONE

FUNCTIONS.invit = function (msg) {
    bot.createInvite(msg.channel,{maxAge:1800,maxUses:1});
};  //TODO faire la fonction !invite

FUNCTIONS.deletemessages = function(msg, args) {
    var limite = 1 + parseInt(args[1]);
    if (limite == null || limite > 100)
        return;
    msg.channel.fetchMessages({limit: limite})
        .then(function(messages) {
            msg.channel.bulkDelete(messages);
        });
};  //TODO fixer le deletemessage !delete HH:MM-JJ/MM/AA

function quote(msg) {
    mongoose.model('Quotes', QuoteSchema);

    var quote = msg.content.split('\"');
    if (quote.length != 3) {
        msg.channel.sendMessage('```MARKDOWN\n\#Quote Invalide\n' +
            '-> " insert quote here " -Auteur ```');
        return;
    }

    var tmp = new mongoose.models.Quotes();

    var auteur = quote[2].split('-');
    tmp.author = auteur[auteur.length - 1];
    tmp.submitted_by = msg.author.username;
    tmp.quote = quote[1];

    if  (mongoose.connection.readyState == 0)
        msg.channel.sendMessage('```MARKDOWN\n\#Erreur de sauvegarde (server offline)```');

    tmp.save(function (err) {
        if (err){
            console.log('erreur sauvegarde', err);
            msg.channel.sendMessage('```MARKDOWN\n\#Erreur de sauvegarde (tmp.save)```');
        }else {
            console.log('citation enregistrée');
            msg.channel.sendMessage('```MARKDOWN\n\#Derniere quote enregistrée dans la base de données:\n' +
                'quote = ' + tmp.quote + '\n' +
                'auteur = ' + tmp.author + '\n' +
                'envoyé par = ' + tmp.submitted_by + '```');
        }
    });
    msg.channel.fetchMessages({limit: 20})
        .then(function(messages) {
            messages.forEach(function (message) {
                if (message.author.username == bot.user.username)
                    message.delete();
            });
        });
};  //TODO ajouter la date et l'ID
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
            case 'dbcheck' :
                return FUNCTIONS.dbcheck(msg);
            //case 'invit' :
            //    return FUNCTIONS.invit(msg);
            //case 'delete' :
            //    return FUNCTIONS.deletemessages(msg,args);
            default:
                return msg.reply('Commande Invalide');
        }
    }
    if(args[0].substr(0, 1) == '\"' && msg.channel.name === 'quote')
        return quote(msg);
});
//

///////////////////////////////////Connexion au serveur
bot.login('MjcwODM4NTg4MjIzMTI3NTUy.C2D5Ww.lPi1isP-nFOAkD2HUp3brzg7y8Y');
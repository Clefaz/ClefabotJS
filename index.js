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
FUNCTIONS.pd = function(msg) {
    msg.reply('C\'EST TAMER LE PD !');
};    //DONE

FUNCTIONS.ping = function(msg) {
    msg.reply('pong ! #joke');
};    //DONE

FUNCTIONS.pong = function(msg) {
    msg.reply('c\' est !ping, abruti !!');
};    //DONE

FUNCTIONS.introduction = function(msg){
    msg.channel.sendMessage('bonjour a tous !, je suis ' + bot.user + ' \n' +
        'je suis ici pour vous aider autant que possible, après tout, c\'est ma principale fonction !\n' +
        'vous pouvez essayer de discuter avec moi mais pas sûr que je réponde :/ je vous avoue que je n\'en suis qu\'à ma version 1.0 :p\n' +
        'mais vous pourrez quand meme accéder a quelques commandes:\n' +
        '```' +
        '!help = je vous enverrai un MP avec de l\'aide ! :)\n' +
        '!ping = si je suis en ligne, je vous répondrai (ne sers qu\'a tester la connexion.)\n'+
        '!dbcheck = vérifie l\'état de la base de données, si jamais vous pensez qu\'il y a un soucis\n' +
        '```' +
        'Mais la fonction principale sera sur le channel quote !\n' +
        'en effet a présent, toutes les quotes que vous posterez seront **enregistrées** ! et on pourra a l\'avenir les consulter ! :)' +
        'c\'est tout pour le moment, il y aura plus de fonctionnalités dans de futures updates !');
}

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
    var quote = msg.content.split('\"');
    if (quote.length != 3) {
        msg.channel.sendMessage('```MARKDOWN\n\#Quote Invalide\n' +
            '-> " insert quote here " -Auteur ```');
        return;
    }
    if  (mongoose.connection.readyState == 0) {
        msg.channel.sendMessage('```MARKDOWN\n\#Erreur de sauvegarde (server offline)```');
        return;
    }

    mongoose.model('Quotes', QuoteSchema);

    var tmp = new mongoose.models.Quotes();
    var auteur = quote[2].split('-');
    tmp.author = auteur[auteur.length - 1];
    tmp.submitted_by = msg.author.username;
    tmp.quote = quote[1];

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
};  //TODO ajouter la date et l'ID + affiner fonction delete
//

///////////////////////////////////Events
bot.on('ready', function() {
    console.log('Logged in as \"' + bot.user.username + '\"');
});

bot.on('message', function(msg) {
    var args = msg.content.split(' ');
    if(args[0].substr(0, 1) == '!') {
        switch(args[0].substr(1)) {
            case 'pd':
                return FUNCTIONS.pd(msg);
            case 'ping':
                return FUNCTIONS.ping(msg);
            case 'pong':
                return FUNCTIONS.pong(msg);
            case 'help':
                return FUNCTIONS.help(msg);
            case 'dbcheck' :
                return FUNCTIONS.dbcheck(msg);
            case 'introduction':
                return FUNCTIONS.introduction(msg);
            //case 'invit' :
            //    return FUNCTIONS.invit(msg);
            //case 'delete' :
            //    return FUNCTIONS.deletemessages(msg,args);
            default:
                return msg.reply('Commande Invalide -> !help');
        }
    }
    if(args[0].substr(0, 1) == '\"' && msg.channel.name === 'quote')
        return quote(msg);
});
//

///////////////////////////////////Connexion au serveur
bot.login('MjcwODM4NTg4MjIzMTI3NTUy.C2D5Ww.lPi1isP-nFOAkD2HUp3brzg7y8Y');
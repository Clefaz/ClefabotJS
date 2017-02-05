const Discord = require("discord.js");
const mongoose = require('mongoose');
const moment = require('moment');
mongoose.Promise = global.Promise;

const bot = new Discord.Client();

const FUNCTIONS = {};

const debug = false;

mongoose.connect('mongodb://localhost:27017/clefabot', function (err) {
    if (err){
        console.log('erreur de connection a la base de données');
    }
    else {
        console.log('connecté a la base de données');
    }
});


QuoteSchema = new mongoose.Schema({
    author: String, // le mec qui a écrit ça (son nom)
    submitted_by: String, // le mec qui a envoyé la citation (son nom)
    quote: String, // la citation
    time: String,
});
mongoose.model('quotes', QuoteSchema);
InviteSchema = new mongoose.Schema({
    tag: String, // le mec qui a écrit ça (son nom)
    name: String,
    tokens: Number,
    maxtokens: Number,
    lastfill: String,
});
mongoose.model('invites', InviteSchema);

///////////////////////////////////Commandes
FUNCTIONS.plug = function (msg) {
    msg.channel.sendMessage('l\'adresse du plug est https://plug.dj/phoenixteammusic');
};   //DONE

FUNCTIONS.rules = function (msg) {
    msg.reply('voila les règles !');
    msg.channel.sendFile('rules.pdf');
};  //DONE

FUNCTIONS.say = function (msg) {
    var str = msg.content.substr(5)
    msg.delete();
    msg.channel.sendMessage(str);
};    //DONE

FUNCTIONS.ping = function (msg) {
    msg.reply('pong ! #joke');
};   //DONE

FUNCTIONS.pong = function (msg) {
    msg.reply('c\' est !ping, abruti !!');
};   //DONE

FUNCTIONS.introduction = function (msg) {
    msg.channel.sendMessage('bonjour a tous !, je suis ' + bot.user + ' \n' +
        'je suis ici pour vous aider autant que possible, après tout, c\'est ma principale fonction !\n' +
        'vous pouvez essayer de discuter avec moi mais pas sûr que je réponde :/ je vous avoue que je n\'en suis qu\'à ma version 1.0 :p\n' +
        'mais vous pourrez quand meme accéder a quelques commandes:\n' +
        '```' +
        '\n!help = je vous enverrai de l\'aide ! :)'+
        '\n!ping = si je suis en ligne, je vous répondrai (ne sers qu\'a tester la connexion.)'+
        '\n!rules = je posterai les règles du serveur'+
        '\n!plug = si jamais vous avez oublié le lien du plug.dj'+
        '\n!invit = je vous enverrai une invitation pour rejoindre le discord (valable pour 1 personne et dans la demi-heure qui suit. vous pouvez en générer maximum 3 par mois)'+
        '```' +
        'Mais la fonction principale sera sur le channel quote !\n' +
        'en effet a présent, toutes les quotes que vous posterez seront **enregistrées** ! et on pourra a l\'avenir les consulter ! :)\n' +
        'respectez seulement cette syntaxe: `"quote" -auteur`' +
        'c\'est tout pour le moment, il y aura plus de fonctionnalités dans de futures updates !\n');
};  //DONE

FUNCTIONS.help = function (msg) {
    msg.reply('\n!help = je vous enverrai de l\'aide ! :)'+
    '\n!ping = si je suis en ligne, je vous répondrai (ne sers qu\'a tester la connexion.)'+
    '\n!rules = je posterai les règles du serveur'+
    '\n!plug = si jamais vous avez oublié le lien du plug.dj'+
    '\n!invit = je vous enverrai une invitation pour rejoindre le discord (valable pour 1 personne et dans la demi-heure qui suit. vous pouvez en générer maximum 3 par mois)'+
    '\nla derniere et principale feature est dans le salon #quote, mais elle est automatique, respectez seulement cette syntaxe: `"quote" -auteur`');
};  //DONE

FUNCTIONS.dbtest = function () {
    mongoose.connect('mongodb://localhost:27017/clefabot', function (err) {
        if (err){
            console.log('erreur de connection a la base de données');
        }
        else {
            console.log('connecté a la base de données');
        }
    });
};//DONE

FUNCTIONS.invit = function (msg) {
    mongoose.models.invites.findOne({tag: msg.author.discriminator},function (err, tag) {
        if (err) {
            msg.reply('erreur de database /!\\ merci de contacter Clefaz');
        } else {
            if (tag == null) {
                tag = new mongoose.models.invites();
                tag.tag = msg.author.discriminator;
                tag.name = msg.author.username;
                tag.tokens = 3;
                tag.maxtokens = 3;
                tag.lastfill = moment.utc(msg.createdAt).format('DD/MM/YY');
            } else {
                while (moment(tag.lastfill,'DD/MM/YY').add(1,'months') < moment.utc(msg.createdAt)) {
                    tag.tokens = tag.maxtokens;
                    tag.lastfill = moment(tag.lastfill,'DD/MM/YY').add(1,'months').format('DD/MM/YY');
                }
            }
            if (tag.tokens > 0) {
                tag.tokens--;
                msg.reply('je t\'ai envoyé une invit\n il t\'en reste: ' + tag.tokens + ' / ' + tag.maxtokens + '\nrechargement le ' + moment(tag.lastfill,'DD/MM/YY').add(1,'months').format('DD/MM/YY'));
                msg.channel.createInvite({maxAge: 1800, maxUses: 1})
                    .then(function (result) {
                        msg.author.sendMessage("VOILA FDP "+result);
                    });
            } else {
                msg.reply('vous avez deja invité ' + tag.maxtokens +
                    ' personnes depuis le mois dernier, vous pourrez en inviter d\'autres a partir du ' +
                    moment(tag.lastfill,'DD/MM/YY').add(1,'months').format('DD/MM/YY'));
            }
        }
        mongoose.models.invites.remove({tag: msg.author.discriminator});
        tag.save(function (err) {
            if (err) {
                console.log('error')
            }
        });
    });
    msg.delete();
};  //DONE

FUNCTIONS.deletemessages = function (msg, args) {
    var limite = 1 + parseInt(args[1]);
    if (limite == null || limite > 100)
        return;
    msg.channel.fetchMessages({limit: limite})
        .then(function (messages) {
            msg.channel.bulkDelete(messages);
        });
};  //TODO fixer le deletemessage !delete HH:MM-JJ/MM/AA

FUNCTIONS.neperms = function (msg) {
    msg.reply('tu n\'a pas la permission d\'utiliser cette commande !');
    msg.delete();
};

function quote(msg) {
    var quote = msg.content.split('\"');
    if (quote.length != 3) {
        msg.channel.sendMessage('```MARKDOWN\n\#Quote Invalide\n' + '-> " insert quote here " -Auteur ```');
        return;
    }
    if (mongoose.connection.readyState == 0) {
        msg.channel.sendMessage('```MARKDOWN\n\#Erreur de sauvegarde (server offline)```');
        return;
    }

    var auteur = quote[2].split('-');
    mongoose.models.Quotes.count({}, function (err, result) {
        if (!err){
            var tmp = new mongoose.models.Quotes();
            tmp.author = auteur[auteur.length - 1];//
            tmp.submitted_by = msg.author.username;
            tmp.quote = quote[1];
            tmp.time = moment.utc(msg.createdAt).format('DD/MM/YY HH:mm:ss');
            tmp.save(function (err) {
                if (err) {
                    console.log('erreur sauvegarde', err);
                    msg.channel.sendMessage('```MARKDOWN\n\#Erreur de sauvegarde (tmp.save)```');
                } else {
                    console.log('citation enregistrée');
                    msg.channel.sendMessage('```MARKDOWN\n\#Derniere quote enregistrée dans la base de données:\n' +
                        'quote n° #' + result + 1 + ' = ' + tmp.quote + '\n' +
                        'auteur = ' + tmp.author + '\n' +
                        'envoyé par = ' + tmp.submitted_by + '\n' +
                        'le ' + tmp.time +
                        '```');
                }});
        }});
    msg.channel.fetchMessages({limit: 20})
        .then(function (messages) {
            messages.forEach(function (message) {
                if (message.author.username == bot.user.username)
                    message.delete();
            });
        });
};

///////////////////////////////////Events
bot.on('ready', function () {
    console.log('Logged in as \"' + bot.user.username + '\"');
    bot.user.setGame('by Clefaz :)');
});

bot.on('message', function (msg) {
    var args = msg.content.split(' ');
    if (args[0].substr(0, 1) == '!') {
        switch (args[0].substr(1)) {
            case 'plug':
                return FUNCTIONS.plug(msg);
            case 'rules':
                return FUNCTIONS.rules(msg);
            case 'ping':
                return FUNCTIONS.ping(msg);
            case 'pong':
                return FUNCTIONS.pong(msg);
            case 'help':
                return FUNCTIONS.help(msg);
            case 'dbtest' :
                if (msg.member.roles.find('name','Admin'))
                    return FUNCTIONS.dbtest();
                else return FUNCTIONS.neperms(msg);
            case 'introduction':
                if (msg.member.roles.find('name','Admin'))
                    return FUNCTIONS.introduction(msg);
                else return FUNCTIONS.neperms(msg);
            case 'say':
                if (msg.member.roles.find('name','Admin'))
                    return FUNCTIONS.say(msg);
                return FUNCTIONS.neperms(msg);
            case 'invit' :
                if (msg.member.roles.find('name','Admin') ||
                    msg.member.roles.find('name','Membres') ||
                    msg.member.roles.find('name','Habitués'))
                    return FUNCTIONS.invit(msg, bot);
                else return FUNCTIONS.neperms(msg);
            case 'delete' :
                if (msg.member.roles.find('name','Admin'))
                    return FUNCTIONS.deletemessages(msg,args);
                else return FUNCTIONS.neperms(msg);
            default:
                return msg.reply('Commande Invalide -> !help');
        }
    }
    if (args[0].substr(0, 1) == '\"' && msg.channel.name === 'quote')
        return quote(msg);
});

///////////////////////////////////Connexion au serveur
if (debug == true)
    bot.login('MjcwODM4NTg4MjIzMTI3NTUy.C2ZgcQ.R_WGOAE_7ct4u6cgRYBAG-36LVY');   //Token debug
else
    bot.login('MjcwNTY3Mzk4NjM2MTI2MjA4.C2ZriA.ksQpJd3zkr8DDEz1ZRUkGYeowtY');   //Token release
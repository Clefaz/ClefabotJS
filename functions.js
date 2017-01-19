var mongoose = require('./mongoose.js');

var FUNCTIONS = {};

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

FUNCTIONS.dbinit = function (msg) {
    mongoose.Schema({
        name: { type: String, index: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }
    });
};

FUNCTIONS.invit = function (msg) {
    msg.client.createInvite(msg.channel,null,function (msg) {
        if (err)
            msg.channel.sendMessage("erreur, consultez @clefaz");
        else
            msg.channel.sendMessage(invite);
    });
};

module.exports = FUNCTIONS;
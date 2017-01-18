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

FUNCTIONS.dbconnect = function(msg, mongoose){
    msg.channel.sendMessage('ok');
}

module.exports = FUNCTIONS;
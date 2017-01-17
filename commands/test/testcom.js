const commando = require('discord.js-commando');

class TestCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'truc',   //commande
            group: 'test',
            memberName: 'test',
            description: 'commandes de test'
        })
    }

    async run(message, args) {
        message.reply("test");
    }
}

module.exports = TestCommand;
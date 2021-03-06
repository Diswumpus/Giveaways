const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js');

module.exports = {
    name : 'reroll',
    execute: async (message, Member, args) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You do not have permission')

        if(!args[0]) return message.channel.send('Please specify a message id')

        const giveaway = message.client.giveaways.find(g => g.id == args[0]);
        if(!giveaway) return message.channel.send('Couldn\'t find the giveaway.')
        const very = message.client.emojis.cache.find(em => em.name === "verifed");
        message.client.giveaways.reroll(giveaway.messageID)
            .then(() => {
                message.channel.send(`Giveaway rerolled ${very}`);
            })
            .catch(err => {
                console.log(err);
            })
    }
}
const Discord = require('discord.js');
const ms = require("ms");
const giveaway = require('../models/giveway');

module.exports = {
    name: 'browse',
    async execute(client, interaction) {
        const docs = await giveaway.find({ ended: false }).limit(4).sort({ 'ends': -1 });
        const colorr = '#2F3136'
        const emoji1 = client.emojis.cache.get('845124057778618418');
        const emoji2 = client.emojis.cache.get('845124442552401950');
        const emoji3 = client.emojis.cache.get('845124067920969729');
        const bembed = new Discord.MessageEmbed()
        .setTitle('Giveaway\'s')
        .setColor(colorr)
        docs.forEach(e => {
            bembed.addField(`Prize: ${e.prize ?? 'Unknown'}`, `[${emoji1}${emoji2}${emoji3}](${e.invite})`, true)
        });
        await interaction.reply(bembed);
    }
}
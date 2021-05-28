const Discord = require('discord.js');
const ms = require("ms");

const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    //ES6 interpolated literals/template literals 
    //If seconds is less than 10 put a zero in front.
    return `${minutes}m ${(seconds < 10 ? "0" : "")}${seconds}s`;
}

module.exports = {
    name: 'reroll',
    async execute(client, interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
        interaction.reply(`You don't have permissions!`)
        }
        if (interaction.member.permissions.has('MANAGE_MESSAGES')) {
            const m = interaction.options[0].value;
            //const m = interaction.channel.messages.cache.fetch(`${giveawayid}`);
            const atada = client.emojis.cache.get('836421450252550199');
            const timer = client.emojis.cache.get('846868929065517066');
            const firee = client.emojis.cache.get('846908253740204072');
            const colorr = '#90254C'
                try {
                    const currentReact = m.reactions.cache.first();

                    let winner = currentReact
                        .users.cache.filter((u) => !u.bot)
                        .random();
                    channel.send(
                        `${winner} - ${emoji}`
                    );
                    const winmessagetwo = new Discord.MessageEmbed()
                        .setTitle(`You have won ${title}!`)
                        .setDescription(`Yay! You have won [this](${m.url})`)
                        .setFooter(`Giftbox`, firee.url)
                        .setColor(colorr)
                    winner.send(winmessagetwo)
                    const giveawyastarted = new Discord.MessageEmbed()
                    .setTitle(`${firee}**New winner(s) have been selected!**`)
                    .setDescription(`Congratulations!\n${winner}`)
                    .setColor(colorr)
                await interaction.reply(giveawyastarted);
                } catch (error) {
                    console.error(error);
                }
        }
    }
}
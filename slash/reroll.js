const Discord = require('discord.js');
const ms = require("ms");
const giveaway = require('../models/giveway');
const shuffleArray = (a) => { // Fisher-Yates shuffle, no side effects
    if (a.length === 0) return a;
    var i = a.length, t, j;
    a = a.slice();
    while (--i) t = a[i], a[i] = a[j = ~~(Math.random() * (i + 1))], a[j] = t;
    return a;
}

module.exports = {
    name: 'reroll',
    async execute(client, interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            interaction.reply(`You don't have permissions!`)
        }
        if (interaction.member.permissions.has('MANAGE_MESSAGES')) {
            const m = interaction.options?.find(c => c?.name === 'giveaway')?.value;
            const winnerCount = interaction.options?.find(c => c?.name === 'winners')?.value-1 || 0;
            let message;
            let tgi;
            if(m.length === 4){
                tgi = await giveaway.findOne({
                    id: m
                })
                message = await interaction.channel.messages.fetch(tgi.mid);
            } else {
                tgi = await giveaway.findOne({
                    mid: m
                })
                message = await interaction.channel.messages.fetch(m);
            }
                const emoji = client.emojis.cache.get('836421450252550199');
                const timer = client.emojis.cache.get('846868929065517066');
                const firee = client.emojis.cache.get('846908253740204072');
                const colorr = '#2F3136'
                try {
                    const currentReact = message.reactions.cache.first();

                    // let winner = currentReact
                    //     .users.cache.filter((u) => !u.bot && u.id.includes(tgi.winner))
                        const winnerrs = [];
                        let winners = shuffleArray(Array.from(currentReact.users.cache.filter((u) => !u.bot).map(t => t)));
                        for (let il = 0; il < Math.min(winnerCount, winners.length); il++) {
                            let winner = winners[il];
                            const winmessagetwo = new Discord.MessageEmbed()
                                .setTitle(`You have won ${tgi.prize}!`)
                                .setDescription(`Yay! You have won [this](${message.url})`)
                                .setFooter(`Giftbox`, firee.url)
                                .setColor(colorr)
                            winner.send(winmessagetwo)
                            winnerrs.push(winner.id)
    
                        }

                        winnerss = winners.map(winnerr => winnerr).join(', ')
                    await interaction.channel.send(`${winnerss} - ${emoji}`);
                    const winmessagetwo = new Discord.MessageEmbed()
                        .setTitle(`You have won a giveaway!`)
                        .setDescription(`Yay! You have won [this](${message.url})`)
                        .setFooter(`Giftbox`, firee.url)
                        .setColor(colorr)
                    //winner.send(winmessagetwo);
                    const giveawyastarted = new Discord.MessageEmbed()
                        .setTitle(`${firee}**New winner(s) have been selected!**`)
                        .setDescription(`Congratulations!\n${winnerss}`)
                        .setColor(colorr)
                    await interaction.reply(giveawyastarted);
                } catch (error) {
                    console.error(error);
                }
        }
    }
}
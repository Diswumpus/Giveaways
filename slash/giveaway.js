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
    name: 'giveaway',
    async execute(client, interaction) {
        const title = interaction.options[0].value;
        const channel = interaction.options[1].channel;
        const length = interaction.options[2].value;
        const description = interaction.options[3].value;
        const emoji = interaction.options[4].value;
        await interaction.reply(`Giveaway created in ${channel}`);
        const atada = client.emojis.cache.get('836421450252550199');
        const timer = client.emojis.cache.get('846868929065517066');
        const firee = client.emojis.cache.get('846908253740204072');
        const colorr = '#90254C'
        //const channel = client.channels.cache.get(channel)
        if (interaction.options[5]) {
            channel.send(`**${atada} GIVEAWAY ${interaction.options[5].role} ${atada}**`)
        }
        const gembed = new Discord.MessageEmbed()
            .setAuthor(`${length}`, timer.url)
            .setTitle(`${title}`)
            .setDescription(`${description}`)
            .setFooter(`1 Winner | Ends => ${length}`)
            .setColor(colorr)
            .setTimestamp(Date.now() + ms(length))
        const m = await channel.send(gembed);
        const countdownInterval = 5000;
        var refreshIntervalId = setInterval(myCallback, countdownInterval);
        let totalSeconds = ms(length);
        function myCallback() {
            totalSeconds = totalSeconds - countdownInterval;
            if (totalSeconds <= 0)
            {
                console.log(`Clearing interval counter... ${totalSeconds}` )
                clearInterval(refreshIntervalId);
            }
            gembed.setAuthor(`${millisToMinutesAndSeconds(ms(length) - totalSeconds)}`, timer.url)
            //m.edit(gembed);
        }
        m.react(emoji);

        const giveawayend = new Discord.MessageEmbed()
        .setAuthor(`${title}`)
        .setTitle(`${firee} Giveaway has ended`)
        .setFooter(`Ended =>`)
        .setColor(colorr)
        .setTimestamp(Date.now() + ms(length))


        setTimeout(() => {
            try {
                m.edit(giveawayend)
                const xtadaembed = new Discord.MessageEmbed()
                    .setTitle('No winner')
                    .setDescription(`Nobody has reacted!`)
                    .setColor(colorr)
                const currentReact = m.reactions.cache.first();
                  if (!currentReact)
                  {
                    channel.send(`${emoji}`);
                    return channel.send(xtadaembed)
                  }
                // if (m.reactions.cache.get(emoji).count <= 1) {
                //     channel.send(`${emoji}`);
                //     return channel.send(xtadaembed)
                // }
                let winner = currentReact
                    .users.cache.filter((u) => !u.bot)
                    .random();
                channel.send(
                    `${winner} - ${emoji}`
                );
                const tadaembed = new Discord.MessageEmbed()
                    .setTitle('Congratulations!')
                    .setDescription(`${winner} has won [${title}](${m.url})!`)
                    .setColor(colorr)
                channel.send(tadaembed)
            } catch (error) {
                console.error(error);
            }
        }, ms(length));


        // setTimeout(() => {
        //     let reactResult = m.reactions.cache.get(emoji.id);
        //     if (reactResult.users) {
        //         let winner = reactResult.users.cache.filter((u) => !u.bot).random();
        //         channel.send(
        //             `${winner} - ${emoji}`
        //         );
        //         const tadaembed = new Discord.MessageEmbed()
        //             .setTitle('Congratulations!')
        //             .setDescription(`${winner} has won [${title}](${m.url})!`)
        //             .setColor(colorr)
        //         channel.send(tadaembed)
        //     }
        //     else {
        //         const tadaembed = new Discord.MessageEmbed()
        //             .setTitle('No winner')
        //             .setDescription(`there is no winner`)
        //             .setColor(colorr)
        //         channel.send(tadaembed)
        //     }
        // }, ms(length))
    }
}
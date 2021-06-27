const Discord = require('discord.js');
const ms = require("ms");

const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    //ES6 interpolated literals/template literals 
    //If seconds is less than 10 put a zero in front.
    return `${minutes}m ${(seconds < 10 ? "0" : "")}${seconds}s`;
}

const shuffleArray = (a) => { // Fisher-Yates shuffle, no side effects
    if (a.length === 0) return a;
    var i = a.length, t, j;
    a = a.slice();
    while (--i) t = a[i], a[i] = a[j = ~~(Math.random() * (i + 1))], a[j] = t;
    return a;
}

module.exports = {
    name: 'giveaway',
    async execute(client, interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            interaction.reply(`You don't have permissions!`)
        }
        if (interaction.member.permissions.has('MANAGE_MESSAGES')) {
            const title = interaction.options?.find(c => c?.name === 'title')?.value;
            const channel = interaction.options?.find(c => c?.name === 'channel')?.channel;
            const length = interaction.options?.find(c => c?.name === 'length')?.value;
            const description = interaction.options?.find(c => c?.name === 'description')?.value;
            const atada = client.emojis.cache.get('836421450252550199');
            const timer = client.emojis.cache.get('846868929065517066');
            const firee = client.emojis.cache.get('846908253740204072');
            const emoji = interaction.options?.find(c => c?.name === 'emoji')?.value || atada;
            const winnerCount = interaction.options?.find(c => c?.name === 'winners')?.value-1 || 0;
            const colorr = '#2F3136'
            //const channel = client.channels.cache.get(channel)
            if (interaction.options?.find(c => c?.name === 'ping')?.role) {
                channel.send(`**${atada} GIVEAWAY ${interaction.options?.find(c => c?.name === 'ping')?.role} ${atada}**`)
            }
            const aend = ms(length);
            const endtime = Date.now() + ms(length)
            const end = Math.floor(new Date().getTime() / 1000.0)
            const gembed = new Discord.MessageEmbed()
                .setAuthor(`${length}`, timer.url)
                .setTitle(`${title}`)
                .setDescription(`${description || 'A great giveaway!'}\n\n${timer} Ends: <t:${Math.floor(endtime / 1000.0)}:R>`)
                .setFooter(`1 Winner`)
                .setColor(colorr)
                .setTimestamp(Date.now() + ms(length))
            const m = await channel.send(gembed);
            /* MONGO STUFF */
            /* !--
            ended: Boolean,
            ends: String,
            user: String,
            guild: String,
            winner: String,
            mid: String,
            prize: String,
            invite: String,
            */
            let invite = await interaction.channel.createInvite({
                maxAge: 0, // 0 = infinite expiration
                maxUses: 0 // 0 = infinite uses
              }).catch(console.error);
            const giveaway = require('../models/giveway')
            const { v4: uuidv4 } = require('uuid');
            let gi = Math.floor(Math.random() * 5000);
            let tgi;
            let ie = false;
            for(;;){
                tgi = await giveaway.findOne({
                    id: gi
                })
                if(gi !== tgi?.id || tgi?.id === 'null'){
                    ie = true
                } else {
                    gi = Math.floor(Math.random() * 5000);
                }
                if(ie === true){ break; }
            }
            const gwid = gi;
            let messageUser = new giveaway({
                ended: false,
                ends: ms(length),
                user: interaction.user.id,
                guild: interaction.guild.id,
                mid: m.id,
                prize: title,
                invite: invite,
                id: gwid
            });
            await messageUser.save().catch(e => console.log(e));
            /* END */
            m.react(emoji);
            const giveawyastarted = new Discord.MessageEmbed()
                .setTitle(`${firee}**Giveaway has started!**`)
                .setDescription(`You can edit your giveaway by using \`/edit ${gwid}\`\n\n[View Giveaway](${m.url})`)
                .setColor(colorr)
            await interaction.reply(giveawyastarted);


            setTimeout(async () => {
                try {
                    const giveawayend = new Discord.MessageEmbed()
                        .setAuthor(`${title}`)
                        .setTitle(`${firee} Giveaway has ended`)
                        .setDescription(`Ended: <t:${Math.floor(new Date().getTime() / 1000.0)}:R>`)
                        .setColor(colorr)
                        .setTimestamp(Date.now() + ms(length))
                    m.edit(giveawayend)
                    const xtadaembed = new Discord.MessageEmbed()
                        .setTitle('No winner')
                        .setDescription(`Nobody has reacted!`)
                        .setColor(colorr)

                    const currentReact = m.reactions.cache.first();
                    const nobotr = currentReact.users.cache.filter((u) => !u.bot);
                    if (nobotr.size === 0) {
                        channel.send(`${emoji}`);
                        return channel.send(xtadaembed)
                    }
                    // if (m.reactions.cache.get(emoji).count <= 1) {
                    //     channel.send(`${emoji}`);
                    //     return channel.send(xtadaembed)
                    // }
                    const winnerrs = [];
                    let winners = shuffleArray(Array.from(currentReact.users.cache.filter((u) => !u.bot).map(t => t)));
                    for (let il = 0; il < Math.min(winnerCount, winners.length); il++) {
                        let winner = winners[il];
                        const winmessagetwo = new Discord.MessageEmbed()
                            .setTitle(`You have won ${title}!`)
                            .setDescription(`Yay! You have won [this](${m.url})`)
                            .setFooter(`Giftbox`, firee.url)
                            .setColor(colorr)
                        winner.send(winmessagetwo)
                        winnerrs.push(winner.id)

                    }
                    /* MONGO STUFF */
                    await giveaway.findOne({
                        id: gwid
                    }, async (err, dUser) => {
                        if (err) console.log(err);
                        dUser.ended = true;
                        dUser.winner = winnerrs;
                            await dUser.save().catch(e => console.log(e));
                    });
                    /* MONGO STUFF */
                    winnerss = winners.map(winnerr => winnerr).join(', ')
                    if (winners.length > 1) {
                        channel.send(`${winnerss} - ${emoji}`);
                        const tadaembed = new Discord.MessageEmbed()
                            .setTitle('Congratulations!')
                            .setDescription(`You have won the giveaway for [${title}](${m.url})!`)
                            .setColor(colorr)
                        channel.send(tadaembed)
                    } else {
                        let winner = winners[0];
                        channel.send(`${winner} - ${emoji}`);
                        const tadaembed = new Discord.MessageEmbed()
                            .setTitle('Congratulations!')
                            .setDescription(`You have won the giveaway for [${title}](${m.url})!`)
                            .setColor(colorr)
                        channel.send(tadaembed)
                    }
                } catch (error) {
                    console.error(error);
                }
            }, ms(length));
        }
    }
}
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
module.exports = {
  name: "giveaway",
  description: "Create a giveaway!",
  usage: "<time> <channel> <emoji> <prize>",
  category: "fun",
  execute: async (message, Member, args) => {
    if (!args[0]) return message.channel.send(`You did not specify your time! ${opps}`);
    const opps = message.client.emojis.cache.find(em => em.name === "ablobglitch");
    const think = message.client.emojis.cache.find(em => em.name === "ablobthinkingeyes");
    if (
      !args[0].endsWith("d") &&
      !args[0].endsWith("h") &&
      !args[0].endsWith("m")
    )
      return message.channel.send(
        `You did not use the correct formatting for the time! ${opps}`
      );
    if (isNaN(args[0][0])) return message.channel.send(`That is not a number! ${opps}`);
    let channel = message.mentions.channels.first();
    if (!channel)
      return message.channel.send(
        `I could not find that channel in the guild! ${think}`
      );
    function isCustomEmoji(emoji) {
      return emoji.split(":").length == 1 ? false : true;
    }      
    let prize = args.slice(3).join(" ");
    let time = args[0];
    let emoji = args[2]; //.slice(3).join(" ");
    let reacty = emoji; // message.client.emojis.cache.find(em => em ==);
    if (isCustomEmoji(emoji))
    {
      let emojiId = emoji.split(":")[2].replace('>','');
      reacty = message.client.emojis.cache.find(e => e.id === emojiId);
    }
    const gift = message.client.emojis.cache.find(em => em.name === "blobgift1");
    const party = message.client.emojis.cache.find(em => em.name === "ablobcolorshift");
    if (!prize) return message.channel.send(`No prize specified!`);
    message.channel.send(`Giveaway successfully created in ${channel} for ${prize} made by ${message.author} ${gift}`);
    let Embed = new MessageEmbed()
      .setTitle(`${prize}`)
      .setDescription(
        `${message.author} is hosting a giveaway for **${prize}!**`
      )
      .setFooter("React to join the giveaway")
      .setFooter(`Good luck`, gift.url)
      .addField("Time left:", `${time}`)
      .setTimestamp(Date.now() + ms(args[0]))
      .setColor(`AQUA`);
    let m = await channel.send(Embed);
    let react = reacty; //"🎉"; //'836423414419161138';
    m.react(react);
    setTimeout(() => {
      if (m.reactions.cache.get(react.id).count <= 1) {
        message.channel.send(`Reactions: ${m.reactions.cache.get(react).count}`);
        return message.channel.send(
          `Not enough people reacted for me to start draw a winner! ${opps}`
        );
      }
      let winner = m.reactions.cache
        .get(react.id)
        .users.cache.filter((u) => !u.bot)
        .random();
      channel.send(
        `${party} Congratulations ${winner}! You won **${prize}**! ${gift}`
      );
    }, ms(args[0]));
  },
};
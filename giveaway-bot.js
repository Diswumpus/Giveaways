const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


mongoose.connect(config.mongoose, { useNewUrlParser: true, useUnifiedTopology: true })

//const keyv = new Keyv('sqlite:react.sqlite');
//keyv.on('error', err => console.error('Keyv connection error:', err));
// at the beginning of your code:
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_INTEGRATIONS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"],


    presence: {
        status: 'online',
        activities: [{ name: `Ready to create a giveaway?`, type: 'PLAYING' }],
    }
});
//Slash commands are out!!
const roleName = '2 Month Supporter';

//client.snipes = new Discord.Collection();

client.once('ready', () => {
    console.log(`I'm Ready!`);
});

client.commands = new Discord.Collection();
client.giveaways = new Discord.Collection();
client.slashcmds = new Discord.Collection();
client.config = config;

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
const slashFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));
const gmessages = mongoose.model('gmessages', Schema({
    id: String,
    guild: String,
    messagecount: Number
}));



client.on("message", async (message) => {
    if (message.guild) {
        let messageUser = await gmessages.findOne({
            id: message.author.id,
            guild: message.guild.id
        });

        if (!messageUser) {
            messageUser = new gmessages({
                id: message.author.id,
                guild: message.guild.id,
                messagecount: 0
            });
            await messageUser.save().catch(e => console.log(e));
        };

        await gmessages.findOne({
            id: message.author.id,
            guild: message.guild.id
        }, async (err, dUser) => {
            if (err) console.log(err);
            dUser.messagecount += 1;
            await dUser.save().catch(e => console.log(e));
        });
    }
})


client.gmessages = gmessages
// Here we load all the commands into client.commands
for (const file of slashFiles) {
    const command = require(`./slash/${file}`);
    console.log(`loading slash/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.slashcmds.set(command.name, command);
}
client.on('interaction', async interaction => {
    if (!interaction.isCommand()) return;
    console.log(`received interaction ${interaction.commandName}`);
    const commandName = interaction.commandName;

    const command = client.slashcmds.get(commandName);
    if (!command) {
        console.error(`Cannot find ${commandName}`);
        // interaction.reply(`Sorry i don't think /${commandName} is possible ${opps}`);
    }
    else {
        try {
            console.log(`Executing ${commandName}`);
            await command.execute(client, interaction);
        } catch (error) {
            console.error(`Error with ${commandName}`);
            console.error(error);
            // interaction.reply(`Something went very wrong ${opps}`);
        }
    }
});

client.on("message", message => {
    const args = message.content.split(" ").slice(1);
    const clean = text => {
        if (typeof (text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
    if (message.content.startsWith(config.prefix + "eval")) {
        if (message.author.id !== config.ownerID) return;
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled), { code: "xl" });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
});

// Here we load all the commands into client.commands
for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    console.log(`loading cmds/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}
// Client events
client.on('message', message => {
    //if(message.content.startsWith(`${prefix}tpwhois`)){
    var Member;
    var status;
    var differentDays = 0;
    if (message.mentions.members) {
        Member = message.mentions.members.first()
        if (!Member) {
            Member = message.member
        }
        status = Member.presence.status
    }

    if (status == "dnd") {
        var status = "Do not Disturb"
    }
    if (Member) {
        var joinedSince = new Date() - Member.joinedAt
        differentDays = Math.round(joinedSince / (1000 * 3600 * 24));
    }
    message.differentDays = differentDays;
    const opps = message.client.emojis.cache.find(em => em.name === "ablobglitch");
    if (message.content.startsWith(config.prefix) && !message.author.bot) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) {
            //message.reply(`Sorry i don't think ${commandName} is possible ${opps}`);
        }
        else {
            try {
                command.execute(message, Member, args);
            } catch (error) {
                console.error(error);
                message.reply(`Something went very wrong ${opps}`);
            }
        }
    }


});

console.log("logging client");

client.login(config.token);
//client.user.setActivity('-help');
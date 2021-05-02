const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const opps = message.client.emojis.cache.find(em => em.name === "ablobglitch");
<<<<<<< HEAD
const gift = message.client.emojis.cache.find(em => em.name === "blobgift1");
=======
>>>>>>> b5030b5e5d2dcaa8fda897c078f2e99cd126d240


//const keyv = new Keyv('sqlite:react.sqlite');
//keyv.on('error', err => console.error('Keyv connection error:', err));
// at the beginning of your code:
const client = new Discord.Client({
    presence: {
        status: 'online',
        activity: {
<<<<<<< HEAD
            name: `.help giveaway ${gift}`,
=======
            name: `.help giveaway`,
>>>>>>> b5030b5e5d2dcaa8fda897c078f2e99cd126d240
            type: 'PLAYING',
        },
    },
});
const roleName = '2 Month Supporter';

//client.snipes = new Discord.Collection();

client.once('ready', () => {
    console.log('Im Ready!');
});

client.commands = new Discord.Collection();
client.config = config;

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

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

    if (message.content.startsWith(config.prefix) && !message.author.bot) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) {
            message.reply(`Sorry i don't think ${commandName} is possible ${opps}`);
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


client.login(config.token);
//client.user.setActivity('-help');
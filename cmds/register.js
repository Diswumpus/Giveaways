const Discord = require('discord.js');

module.exports = {
	name: 'register',
	description: 'DEV ONLY',
	async execute(message, Member, args) {
		const client = message.client
		if (!client.application?.owner) await client.application?.fetch();
		//https://discord.com/oauth2/authorize?client_id=841782635386109972&scope=bot+applications.commands
		const data = {
			name: 'giveaway',
			description: 'Ready to create a giveaway?',
			options: [{
				name: 'title',
				type: 'STRING',
				description: 'What are you giving away?',
				required: true,
			},
			{
				name: 'channel',
				type: 'CHANNEL',
				description: 'Where do you want the giveaway?',
				required: true,
			},
			{
				name: 'length',
				type: 'STRING',
				description: 'How long should the giveaway be?',
				required: true,
			},
			{
				name: 'description',
				type: 'STRING',
				description: 'Give some extra info',
				required: true,
			},
			{
				name: 'emoji',
				type: 'STRING',
				description: 'What emoji?',
				required: true,
			},
			{
				name: 'winners',
				type: 'STRING',
				description: 'How many winners?',
				required: true,
			},
			{
				name: 'ping',
				type: 'ROLE',
				description: 'What ping should appear when i start the giveaway?',
				required: false,
			}]
		};

		const command = await client.application?.commands.create(data);
		//await command.setPermissions(permissions);
		console.log(command);
	}
}
//Slash server =>
//const command = await client.guilds.cache.get('842575277249921074')?.commands.create(data);
//const command = await client.application?.commands.create(data);
//Turtlepaw's =>
//const command = await client.guilds.cache.get('824365717573992480')?.commands.create(data);
//Turtlebot =>
//const command = await client.guilds.cache.get('834199640702320650')?.commands.create(data);
// const permissions = [
//     {
//         id: '820465204411236362',
//         type: 'USER',
//         permission: true,
//     },
// ];
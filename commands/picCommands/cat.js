const Discord = require("discord.js");
const {
	get
} = require("snekfetch");
module.exports = {
	name: 'cat',
	description: 'lookup',
	execute: async (client, message) => {
		const msgArr = message.content.split(' ');
		try {
			get('https://aws.random.cat/meow').then(res => {
				const embed = new Discord.MessageEmbed()
					.setImage(res.body.file)
				return message.channel.send({
					embeds: [embed]
				});
			});
		} catch (err) {
			return message.channel.send(err.stack);
		}
	},
};
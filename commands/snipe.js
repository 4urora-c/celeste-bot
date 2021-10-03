/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const Discord = require("discord.js");
module.exports = {
  name: 'snipe',
  description: 'is',
  execute: async (client, message) => {
    const msg = deletedMessages.get(message.channel.id);
 		 if (!msg) return message.reply('no deleted messages were located.');

 		 const embed = new Discord.MessageEmbed()
 		 	 .setColor('#7cdda5')
 			 .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true }) + "said: ")
 			 .setDescription(msg.content);

        return message.channel.send({embeds: [embed]})
        .catch(err => console.error(err));
  },
};

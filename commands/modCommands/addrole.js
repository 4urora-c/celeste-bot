/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const Discord = require("discord.js");
module.exports = {
  name: 'addrole',
  description: 'set role info',
  execute: async (client, message) => {
      const msgArr = message.content.split(' ');
      if (!message.author.id === '620196347890499604' && !member.permissions.has('MANAGE_ROLES')) return;
      try {
      let role = message.guild.roles.cache.find(r => r.name === msgArr.slice(2).join(' ')) || message.mentions.roles.first() || message.guild.roles.cache.get(msgArr[2]);
      let member = message.mentions.members.first();
      member.roles.add(role).catch(console.error);
      const embedA = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`Added **${member}** to  ${msgArr.slice(2).join(' ')}.`);
      message.channel.send({embeds: [embedA]});
    } catch(err) {
      message.channel.send(`There was an error adding \'**${msgArr.slice(2).join(' ')}**\' to the user.`)
      console.log(err)
    }
    },
  };

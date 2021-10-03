const Discord = require('discord.js');

module.exports = {
  name: 'roles',
  aliases: 'inrole',
  description: 'get user info',
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    if (message.author.id === '620196347890499604' || message.member.permissions.has('MANAGE_ROLES')) {
    const user = message.mentions.users.first() || client.users.cache.get(msgArr[1]) || message.author;
    const userroles = `<@&${message.guild.member(user)._roles.join('>\n <@&')}>`;
    const listEmbed = new Discord.MessageEmbed();
    listEmbed.addField('Roles:', userroles);
    message.channel.send({embed: listEmbed}).catch((error) => {
      message.channel.send('This user has too many roles to display.');
    });
  } else {
    message.channel.send('You do not have permission to run this command.');
  }
  },
};


const Discord = require("discord.js");
module.exports = {
  name: 'users',
  description: 'lookup',
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    if (!message.author.id === '620196347890499604' && !message.member.permissions.has('MANAGE_ROLES')) return;
    if (!msgArr[1]) {
      message.channel.send('You must provide a name!');
      return;
    }
    const username = msgArr[1];
    const memberArray = message.guild.members.cache.array();
    const matches = [];
    memberArray.forEach((member) => {
      if (member.displayName.toLowerCase().includes(username.toLowerCase()) || member.user.username.includes(username.toLowerCase())) {
        matches.push(`> ${member.user.tag}`);
      }
    });
    const embedA = new Discord.MessageEmbed()
    .setColor('#5b4194')
    .setDescription(`__**Lookup matches:**__:\n\n${matches.slice(0, 30).join('\n')}`);
    message.channel.send({embeds: [embedA]});
  },
};

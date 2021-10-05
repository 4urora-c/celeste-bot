const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'permissions',
  description: 'display permissions',
  aliases: ['perms'],
  usage: 'permissions',
  execute: async (client, message, config) => {
    // eslint-disable-next-line max-len
    if (message.author.id !== '620196347890499604' && !message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.permissions.has(['ADMINISTRATOR']))) { return message.reply('You\'re not allowed to use this command!'); }
    const permissionMessage = config.permissions.moderation.map((perm) => `> ${message.guild.roles.cache.get(perm) || message.guild.members.cache.get(perm) || perm}`).join('\n');
    const giveawaysMessage = config.permissions.giveaways.map((perm) => `> ${message.guild.roles.cache.get(perm) || message.guild.members.cache.get(perm) || perm}`).join('\n');
    const welcome = config.permissions.joinrole.map((perm) => `> ${message.guild.roles.cache.get(perm) || message.guild.members.cache.get(perm) || perm}`).join('\n');
    const embed = new MessageEmbed()
      .setTitle('Server Permissions')
      .setThumbnail(`https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png`)
      .setDescription(`**Moderation**:\n${permissionMessage}\n\n**Giveaways**:\n${giveawaysMessage}\n\n**Join Roles**:\n${welcome}`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    message.channel.send({embeds: [embed] });
  },
};

/* eslint-disable consistent-return */
/* eslint-disable max-len */

module.exports = {
  name: 'kick',
  description: 'Kicks the user',
  aliases: 'k',
  usage: 'kick/alias <user> <reason (optional)>',
  execute: async (client, message, config) => {
    if (message.author.id !== '620196347890499604' && !message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.permissions.has(['ADMINISTRATOR']))) { return message.reply('You\'re not allowed to use this command!'); }

    const msgArr = message.content.split(' ');
    const member = message.mentions.members.first() || message.guild.members.cache.get(msgArr[1]);
    message.channel.bulkDelete(1);
    if (!member) { return message.reply('Member doesn\'t exist!'); }
    if (!member.kickable) { return message.reply('You can\'t kick that member!'); }

    let reason = msgArr.slice(2).join(' ');
    if (!reason) reason = 'No Reason Provided';

    await member.send(`You have been kicked because of the following reason: **${reason}**`);
    await member.kick(reason)
      .catch((error) => message.reply(`There was an error ${message.author}! Error: ${error}`));
  },
};

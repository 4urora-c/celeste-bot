/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');
module.exports = {
  name: 'warns',
  description: 'display active warns of the user',
  aliases: ['activewarns'],
  usage: 'warns <user>/warns',
  permissions: true,
  execute: async (client, message, config) => {
    const msgArr = message.content.split(' ');
    if (message.author.id !== '620196347890499604' && !message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.permissions.has(['ADMINISTRATOR']))) { return message.reply('you\'re not allowed to use this command!'); }
    if (msgArr[1] && msgArr[1].toLowerCase() === 'clear') {
      if (msgArr[2]) {
        let clearUser = message.mentions.members.first() || message.guild.members.cache.get(msgArr[2]);
        if (!msgArr[3]) {
        if (clearUser) {
          clear = await client.db.warn.findOneAndDelete({id: clearUser.id, guildID: message.guild.id },
            {
          });
          const embed = new Discord.MessageEmbed()
          .setColor('GREEN')
          .setDescription(`All warns cleared for **${clearUser.user.tag}**.`)
          return message.channel.send({embeds: [embed]})
        }
      } else if (msgArr[3]) {
        let clearUser = message.mentions.members.first() || message.guild.members.cache.get(msgArr[2]);
        let clearUser2 = await client.db.warn.findOne({ id: clearUser.id }) || { warns: [] };
        if(!isNaN(msgArr[3])) {
          let indVal = parseInt(msgArr[3]-1);
          specClear = await client.db.warn.findOneAndUpdate({id: clearUser.id, guildID: message.guild.id }, {
            $pull: {
              warns: clearUser2.warns[indVal]
            }
          }, { upsert: true });
          const embed = new Discord.MessageEmbed()
          .setColor('GREEN')
          .setDescription(`Warn ${indVal+1} cleared for **${clearUser.user.tag}**.`)
          return message.channel.send({embeds: [embed]})
        }
      }
      }
    }
    let targetUser = message.mentions.members.first() || message.guild.members.cache.get(msgArr[1]);
    const currentDate = Date.now();
    let user;
    if (targetUser) {
      user = await client.db.warn.findOne({ id: targetUser.id });
    } else {
      user = await client.db.warn.findOne({ id: message.author.id, guildID: message.guild.id });
      targetUser = message.guild.members.cache.get(message.author.id);
    }
    if (user) {
      if (message.content.includes('!activewarns')) { user.warns = user.warns.filter((warn) => currentDate - warn.date <= config.warnexpiration); }
      if (user.warns.length > 0) {
        const embed = new Discord.MessageEmbed()
        .setDescription(`**${targetUser}'s Active Warnings:**\n\`\`\`\n\n${user.warns.map((warn, index) => {
          const warnDate = new Date(warn.date);
          return `${index + 1}) at ${warnDate.getUTCMonth() + 1}/${warnDate.getUTCDate()}/${warnDate.getUTCFullYear()} for ${warn.reason}.`;
        }).join('\n')}\`\`\`\n\nTo remove warnings, do **;warns clear <user> [index]**`)
        message.channel.send({embeds: [embed]})};
      } else {
        const embed = new Discord.MessageEmbed()
        .setDescription(`**${targetUser} doesn't have any active warnings.**`)
        .setColor('GREEN')
        message.channel.send({embeds: [embed]});
      }
  },
};

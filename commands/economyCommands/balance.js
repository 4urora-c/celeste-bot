/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const Discord = require('discord.js');

module.exports = {
  name: 'balance',
  description: 'Print profile',
  aliases: 'bal',
  execute: async (client, message, config) => {
    const msgArr = message.content.split(' ');
    const guilddata = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (!guilddata.economy || guilddata.economy === 'true') {
    const guilddata = await client.db.islandinfo.findOne({ guildid: message.guild.id });
    const user = message.mentions.users.first() || client.users.cache.get(msgArr[1]) || message.author;
    const userdata = await client.db.userdata.findOne({ id: user.id, guildID: message.guild.id });
    if (userdata) {
      const embed = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setDescription(`${user} has ${userdata.coins} ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!`);
      message.channel.send({embeds: [embed]});
    } else {
      return message.channel.send('Your profile has not been generated yet.');
    }
  } else {
    return message.channel.send('Economy is disabled on this guild!');
  }
  },
};

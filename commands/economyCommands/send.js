/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
const Discord = require('discord.js');
module.exports = {
  name: 'sendpoints',
  description: 'add',
  aliases: 'send',
  usage: 'send @user <amount>',
  execute: async (client, message, config) => {
    const guilddata = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (!guilddata.economy || guilddata.economy === 'true') {
    const msgArr = message.content.split(' ');
    const guilddata = await client.db.islandinfo.findOne({ guildid: message.guild.id });
    const authordata = await client.db.userdata.findOne({ id: message.author.id });
    const target = message.mentions.members.first() || message.guild.members.cache.get(msgArr[2]);
    const amount = parseInt(msgArr[2], 10);
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount to send');
      return;
    }
    if (amount > authordata.coins) {
      const failembed = new Discord.MessageEmbed()
      .setColor('#d40000')
      .setDescription(`You don't have enough ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!`);
      return message.channel.send({embeds: [failembed]});
    } else if (amount <= 0 ) {
      message.channel.send('You cannot send a negative amount!');
      return;

    }
    const embed = new Discord.MessageEmbed()
    .setColor('#0fdb00')
    .setDescription(`✅ ${message.author} gave ${target} ${amount} ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!`);
    message.channel.send({embeds: [embed]});
    await client.db.userdata.updateOne({ id: target.id, guildID: message.guild.id }, { $inc: { coins: amount } }, { upsert: true });
    await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, { $inc: { coins: -amount } }, { upsert: true });
  } else {
    return message.channel.send('Economy is disabled on this guild!');
  }
  },
};

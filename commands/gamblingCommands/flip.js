/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const config = require('../../config');
const Discord = require('discord.js');
module.exports = {
  name: 'flip',
  description: 'flip',
  aliases: [],
  execute: async (client, message) => {
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    const guilddata2 = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (!guilddata2.economy || guilddata2.economy === 'true') {
    const userdata = await client.db.userdata.findOne({ id: message.author.id });
    const msgArr = message.content.split(' ');
    if (isNaN(msgArr[1])) {
      message.channel.send('Enter a valid amount to flip');
      return;
    }
    let flipAmount = parseInt(msgArr[1], 10);
    if (isNaN(flipAmount)) {
      message.channel.send('Enter a valid amount to flip');
      return;
    }
    if (userdata) {
      if (userdata.coins < flipAmount) {
        message.channel.send(`You only have ${userdata.coins} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}!`);
        return;
      } if (flipAmount < 100) {
        message.channel.send(`Minimum flip amount is 100 ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}!`);
        return;
      }

      if (Math.random() <= 0.50) {
        const embed = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`✅ ${message.author} You got ${Math.floor(flipAmount / 2)} 🪙 ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!! You now have ${userdata.coins + Math.floor(flipAmount / 2)} 🪙 ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!`)
        message.channel.send({embeds: [embed]});
        await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, { $inc: { coins: Math.floor(flipAmount / 2) } }, { upsert: true });
      } else {
        const embed = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`❌ ${message.author} You lost ${flipAmount} 🪙 ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!! You now only have ${userdata.coins - flipAmount} 🪙 ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!`)
        message.channel.send({embeds: [embed]});
        await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, { $inc: { coins: flipAmount * -1 } }, { upsert: true });
      }
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  } else {
    return message.channel.send('Economy is disabled on this guild!');
  }
  },
};

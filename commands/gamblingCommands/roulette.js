/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { MessageEmbed } = require('discord.js');
const config = require('../../config');

const black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

module.exports = {
  name: 'roulette',
  description: 'roulette',
  aliases: 'roul',
  execute: async (client, message) => {
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    const guilddata2 = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (!guilddata2.economy || guilddata2.economy === 'true') {
    let win = 0;
    const userdata = await client.db.userdata.findOne({ id: message.author.id, guildID: message.guild.id });
    const msgArr = message.content.split(' ');
    const selectedNumber = parseInt(msgArr[1], 10);
    let amount = parseInt(msgArr[2], 10);
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount to roulette');
      return;
    }
    if (userdata) {
      if (userdata.coins < amount) {
        message.channel.send(`You only have ${userdata.coins} ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!`);
        return;
      } if (amount < 0) {
        message.channel.send(`Minimum roulette amount is 0 ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!`);
        return;
      }

      // ROULETTE PART
      const draw = Math.floor(Math.random() * 37);
      if (msgArr[1].toLowerCase() === 'high') {
        if (draw > 18) {
          win = 1;
        }
      } else if (msgArr[1].toLowerCase() === 'low') {
        if (draw > 0 && draw <= 18) {
          win = 1;
        }
      } else if (msgArr[1].toLowerCase() === 'black') {
        if (black.includes(draw)) {
          win = 1;
        }
      } else if (msgArr[1].toLowerCase() === 'red') {
        if (red.includes(draw)) {
          win = 1;
        }
      } else if (msgArr[1].toLowerCase() === 'green') {
        if (draw === 0) {
          win = 10;
        }
      } else if (msgArr[1].toLowerCase() === 'odd') {
        if (draw % 2 === 1) {
          win = 1;
        }
      } else if (msgArr[1].toLowerCase() === 'even') {
        if (draw % 2 === 0) {
          win = 1;
        }
      } else if (!isNaN(selectedNumber)) {
        if (selectedNumber >= 0 && selectedNumber <= 36) {
          if (selectedNumber === draw) {
            win = 10;
          }
        } else {
          message.channel.send('Invalid Input!');
        }
      }
      if (win > 0) {
        const rewardMessage = new MessageEmbed()
          .setTitle('Roulette')
          .setColor('#31e810')
          .addField('Number Drawn', `${draw}`)
          .addField('You won!', `You won ${(amount + amount * win).toFixed(2)} ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}`)
          .addField('Credits', `You have ${(userdata.coins + (amount * win)).toFixed(2)} ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}`);
        message.channel.send({embeds: [rewardMessage]});
        await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, { $inc: { coins: (amount * win) } }, { upsert: true });
      } else {
        const rewardMessage = new MessageEmbed()
          .setTitle('Roulette')
          .setColor('#d90000')
          .addField('Number Drawn', `${draw}`)
          .addField('You lost!', `You lost ${amount} ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}`)
          .addField('Credits', `You have ${userdata.coins - amount} ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}`);
          message.channel.send({embeds: [rewardMessage]});
          await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, { $inc: { coins: amount * -1 } }, { upsert: true });
      }
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  } else {
    return message.channel.send('Economy is disabled on this guild!');
  }
  },
};

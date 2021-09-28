/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const Discord = require('discord.js');

module.exports = {
  name: 'reroll',
  description: 'reroll giveaway',
  usage: 'reroll <messageID>',
  execute: async (client, message, config) => {
    const msgArr = message.content.split(' ');
    if (message.author.id !== '620196347890499604' && !message.member.roles.cache.some((r) => config.permissions.giveaways.includes(r.id) || message.member.permissions.has(['ADMINISTRATOR']))) { return message.reply('You\'re not allowed to use this command!'); }
    const msgChannel = client.channels.cache.get(msgArr[1]);
    console.log(msgChannel)
    try {
      await msgChannel.messages.fetch(msgArr[2]);
    } catch (err) {
      console.log('Error fetching message');
    }
    const msg = msgChannel.messages.cache.get(msgArr[2]);
    if (!msg) {
      message.channel.send('Error! Giveaway doesn\'t exist!');
      return;
    }

    await msg.reactions.cache.get('🎉').users.fetch();
    const winner = msg.reactions.cache.get('🎉').users.cache.random();
    if (msg.reactions.cache.get('🎉').users.cache.size < 1) {
      const winnerEmbed = new Discord.MessageEmbed()
        .setTitle(`${client.giveaways[msg.id] ? client.giveaways[msg.id].prize : 'Unknown'}`)
        .setColor('36393F')
        .setDescription(`Winner:\nNo one entered the giveaway.`)
      message.channel.send(':tada: **The new winner is:** :tada:')
      message.channel.send({embeds: [winnerEmbed]});
    }
    if (!msg.reactions.cache.get('🎉').users.cache.size < 1) {
      const winnerEmbed = new Discord.MessageEmbed()
        .setTitle(`${client.giveaways[msg.id] ? client.giveaways[msg.id].prize : 'Unknown'}`)
        .setColor('36393F')
        .setDescription(`Winner:\n${winner}`)
        message.channel.send(':tada: **The new winner is:** :tada:')
        message.channel.send({embeds: [winnerEmbed]});    }
  },
};

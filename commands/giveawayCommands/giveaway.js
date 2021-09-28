const Discord = require('discord.js');
const { prefix } = require('../../config');

module.exports = {
  name: 'giveaway',
  aliases: 'ga',
  description: 'create giveaway',
  execute: async (client, message, config) => {
    const msgArr = message.content.split(' ');
    var time = '';
    var time2 = '';
    var time3 = '';
    if (message.author.id !== '620196347890499604' && message.author.id !== '173347297181040640' && !message.member.permissions.has("ADMINISTRATOR")) { return message.reply('You\'re not allowed to use this command!'); }
    if (message.content.split(' ')[2] === '') return message.channel.send('You didn\'t state a duration or a prize for the giveaway.');
    const stated_duration_hours = message.content.split(' ')[1];
    const stated_duration_hours2 = stated_duration_hours.toLowerCase();
    if (stated_duration_hours2.includes('s')) {
      var time = 's';
    }
    if (stated_duration_hours2.includes('m')) {
      var time = 'm';
    }
    if (stated_duration_hours2.includes('h')) {
      var time = 'h';
    }
    if (stated_duration_hours2.includes('d')) {
      var time = 'd';
    }
    const stated_duration_hours3 = stated_duration_hours2.replace(time, '');
    if (stated_duration_hours3 === '0') {
      message.channel.send('The duration has to be atleast one.');
    }
    if (isNaN(stated_duration_hours3)) {
      message.channel.send('The duration has to be a valid time variable.');
    }
    if (stated_duration_hours3 > 1) {
      var time3 = 's';
    }
    if (time === 's') {
      var actual_duration_hours = stated_duration_hours3 * 1000;
      var time2 = 'second';
    }
    if (time === 'm') {
      var actual_duration_hours = stated_duration_hours3 * 60000;
      var time2 = 'minute';
    }
    if (time === 'h') {
      var actual_duration_hours = stated_duration_hours3 * 3600000;
      var time2 = 'hour';
    }
    if (time === 'd') {
      var actual_duration_hours = stated_duration_hours3 * 86400000;
      var time2 = 'day';
    }
    if (!isNaN(stated_duration_hours3)) {
      const prize = message.content.split(' ').slice(2).join(' ');
      if (prize === '') return message.channel.send('You have to enter a prize.');
      if (stated_duration_hours3 !== '0') {
        embed = new Discord.MessageEmbed()
        embed
          .setTitle(`${prize}`)
          .setColor('36393F')
          .setDescription(`React with 🎉 to enter!\nTime duration: **${stated_duration_hours3}** ${time2}${time3}\nHosted by: ${message.author}`)
          .setTimestamp(Date.now() + (actual_duration_hours))
          .setFooter('Ends at');
        const titleMessage =  message.channel.send(":tada: **GIVEAWAY** :tada:")
        const msg = await message.channel.send({embeds:[embed]}); //:tada: **GIVEAWAY** :tada:
        await msg.react('🎉');
        setTimeout(() => {
          msg.reactions.cache.get('🎉').users.remove(client.user.id);
          setTimeout(() => {
            const winner = msg.reactions.cache.get('🎉').users.cache.random();
            client.giveaways[msg.id] = {
              prize,
              winner,
            };
            if (msg.reactions.cache.get('🎉').users.cache.size < 1) {
              const winner_embed = new Discord.MessageEmbed()
                .setTitle(`${prize}`)
                .setColor('36393F')
                .setDescription(`Winner:\nNo one entered the giveaway.\nHosted by: ${message.author}`)
                .setTimestamp()
                .setFooter('Ended at');
                titleMessage.edit(':tada: **GIVEAWAY ENDED** :tada:')
                msg.edit({embeds: [winner_embed]});
            }
            if (!msg.reactions.cache.get('🎉').users.cache.size < 1) {
              const winner_embed = new Discord.MessageEmbed()
                .setTitle(`${prize}`)
                .setColor('36393F')
                .setDescription(`Winner:\n${winner}\nHosted by: ${message.author}`)
                .setTimestamp()
                .setFooter('Ended at');
              titleMessage.edit(':tada: **GIVEAWAY ENDED** :tada:')
              msg.edit({embeds: [winner_embed]});
            }
          }, 1000);
        }, actual_duration_hours);
      }
    }
  },
};

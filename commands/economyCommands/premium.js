/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');
module.exports = {
  name: 'setpremium',
  description: 'set guild configurations',
  aliases: 'premium',
  usage: 'economy disable command',
  execute: async (client, message, config) => {

    const msgArr = message.content.split(' ');
    if (message.author.id !== '620196347890499604' &&  message.author.id !== '391731006958469131' && message.author.id !== '384920723212468225') { return message.channel.send('You\'re not allowed to use this command!'); }
    if (!msgArr[1]) {
      const embed = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setTitle('Celeste Premium')
      .setDescription('Celeste Premium is a way for you to gain additional perks such as monthly currency and the ability to change your profile image. Premium can be obtained through boosting Polaris or winning giveaways.');
      return message.channel.send({embeds: [embed]});
    }
    let target = message.mentions.users.first() || client.users.cache.get(msgArr[1]);
      const userdata = await client.db.islandinfo.findOne({
        id: target.id,
      });
    if (!userdata) {
      return message.channel.send('This user has to set their island info first!')
    }
      if (userdata.hasPremium && !msgArr[2]) {
        const embed = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`${target}'s premium status is ${userdata.hasPremium}!`)
        return message.channel.send({embeds: [embed]});
    } else if (!userdata.hasPremium && !msgArr[2]) {
      const embed = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setDescription(`${target}'s premium status is false!`)
      return message.channel.send({embeds: [embed]});
    }
      if (msgArr[2].toLowerCase() === 'true' || msgArr[2].toLowerCase() === 'false') {
        client.db.islandinfo.updateOne({ id: target.id }, {
          $set: {
            hasPremium: msgArr[2],
          },
        }, { upsert: true });
        const embed = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`You have successfully set premium to ${msgArr[2]} for ${target}!`);
        message.channel.send({embeds: [embed]});
      } else {
        message.channel.send('You can only specify true or false!');
      }
  },
};

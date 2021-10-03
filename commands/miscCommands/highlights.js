/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');
module.exports = {
  name: 'highlights',
  description: 'set guild configurations',
  aliases: 'highlight',
  usage: '!welcome',
  execute: async (client, message, config) => {

    const msgArr = message.content.split(' ');

    const userdata = await client.db.userdata.findOne({id: message.member.id, guildID: message.guild.id });
    if (!msgArr[1]) {
      if(!userdata) return message.channel.send('You do not have a profile yet!')
      if (!userdata.highlightList) return message.channel.send('You\'ve got no highlight words!')
      if (userdata.highlightList.length > 0) {
        return message.channel.send(`Your highlight words are: **${userdata.highlightList.join('**,** ')}**!`);
      } else {
        return message.channel.send('You\'ve got no highlight words!');
      }
    }

    if (msgArr[1] === 'add') {
        await client.db.userdata.updateOne({ id: message.member.id, guildID: message.guild.id }, {
          $push: {
            highlightList: msgArr.slice(2).join(' '),
          },
        }, { upsert: true });
        const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription(`You have successfully added **${msgArr.slice(2).join(' ')}** to your highlights!`);
        message.channel.send({embeds: [embed]});

    } else if (msgArr[1] === 'remove') {
      await client.db.userdata.updateOne({ id: message.member.id, guildID: message.guild.id }, {
        $pull: {
          highlightList: msgArr.slice(2).join(' ')
        }
      }, { upsert: true }).catch((error) => {
        return message.channel.send('There was an error removing the highlight from the database.')
      });
      const doneEmbed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription(`**${msgArr.slice(2).join(' ')}** has been removed from your highlights!`);
      message.channel.send({embeds: [doneEmbed]});
    } else {
      message.channel.send('You need to specify whether you are adding or removing a highlight!');
    }
  },
};

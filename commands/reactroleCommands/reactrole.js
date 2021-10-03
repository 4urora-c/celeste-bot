/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'reactionrole',
  description: 'Make a reactrole message',
  aliases: 'rr',
  usage: 'reactrole',
  execute: async (client, message, config) => {
    const msgArr = message.content.split(' ');
    if (message.author.id !== '620196347890499604' && !message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.permissions.has(['ADMINISTRATOR']))) { return message.reply('You\'re not allowed to use this command!'); }
    let args = msgArr.slice(1).join(' ').split(', ');
    let name = args[0];
    let ts;
    const embed = new MessageEmbed()
      .setTitle(name)
      .setDescription('React to a reaction to get the role!\n\n')
      if (args[1]) {
        try {
        await embed.setColor(args[1].toUpperCase())//.catch((err) => {
          /*if (args[1].length > 7) {
            console.log(err)
            return message.channel.send('That is not a valid colour!');
          }
        })*/} catch(err) {
        if (args[1].length > 7) {
          console.log(err)
          return message.channel.send('That is not a valid colour!');
        }
      }
      }
      if (args[2]) {
        try {
          if (ts !== 'false') {
        await embed.setFooter(args[2])//.catch((err) => {
        /*  console.log(err)
          return message.channel.send('There was an error while creating the embed footer.');
        })*/
      } else {
        await embed.setFooter(args[2])
      }
      } catch(err) {
        console.log(err)
        return message.channel.send('There was an error while creating the embed footer.');
      }
      }
    const reactMessage = await message.channel.send({embeds: [embed]});
    message.delete();

    const guildRole = client.reactrolelocal.find((roleGuild) => roleGuild.id === message.guild.id);

    if (!guildRole) {
      client.reactrolelocal.push({
        id: reactMessage.id,
        roles: {},
      });
    } else {
      guildRole[reactMessage.id] = {
        roles: {},
      };
    }

    client.db.reactrole.updateOne(
      { id: reactMessage.id },
      {
        $set: {
          roles: {},
        },
      },
      { upsert: true },
    );
  },
};

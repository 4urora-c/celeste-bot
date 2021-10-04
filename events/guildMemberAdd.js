/* eslint-disable max-len */
const generateWelcome = require('../utils/generateWelcome');
const Discord = require('discord.js')
module.exports = async (client, distube, member) => {
  //const attachment = await generateWelcome(member.user, member.guild);
  const welcomeChannel = member.guild.channels.cache.get(client.guildConfig[member.guild.id] ? client.guildConfig[member.guild.id].channels.welcomeChannel : null);
  if (welcomeChannel) {
    const embed = new Discord.MessageEmbed()
    .setImage('https://cdn.discordapp.com/attachments/766679330524233779/823161183753863188/image0.png')
    .setDescription(`Welcome **${member.user.username}#${member.user.discriminator}** to **${member.guild.name}**!`)
    welcomeChannel.send({embeds: [embed]}).catch((error) => {
      welcomeChannel.send('Error sending welcome image.');
      console.log(error.stack);
    });
  }
  const currentDate = Date.now();


  const mute = await client.db.mute.findOne({ id: member.id });
  if (mute) {
    const remainingDuration = mute.duration - (currentDate - mute.start);
    if (remainingDuration < 0) {
      member.roles.remove('771253782809411614');
      client.db.mute.deleteOne({ id: mute.id });
    } else {
      member.roles.add('771253782809411614');
    }
  }

  const ban = await client.db.ban.findOne({ id: member.id });
  if (ban) {
    const remainingDuration = ban.duration - (currentDate - ban.start);
    if (remainingDuration < 0) {
      member.roles.remove('806061686423027732');
      client.db.ban.deleteOne({ id: ban.id });
    } else {
      member.roles.add('806061686423027732');
    }
  }
};

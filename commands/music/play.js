const Discord = require('discord.js');
module.exports = {
  name: 'play',
  description: 'Play music',
  aliases: [],
  usage: 'play <music name>',
  admin: false,
  execute: async (client, message, config, distube) => {
    const msgArr = message.content.split(' ');
    if (distube.isPlaying) {
      if (!message.member.voice.channel) {
        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription('You are not connected to the same voice channel as Celeste!')
        return message.channel.send({embeds: [embed]});
      }
    }
    distube.play(message, msgArr.slice(1).join(' '));
  },
};

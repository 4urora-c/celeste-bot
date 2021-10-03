const Discord = require("discord.js");
module.exports = {
  name: 'shuffle',
  description: 'Play music',
  aliases: 'shufflequeue',
  usage: 'play <music name>',
  admin: false,
  execute: async (client, message, config, distube) => {
    const msgArr = message.content.split(' ');
    const djdata = await client.db.config.findOne({
      id: message.guild.id,
    });
    if ((message.member.id !== '620196347890499604' && (djdata.djon ? (djdata.djon === 'true' ? !message.member.roles.cache.some((r) => config.permissions.dj.includes(r.id)) : !message.member.roles.cache.some((r) => r.name.toLowerCase() === 'basic')) : !message.member.permissions.has(['ADMINISTRATOR']) ))) {
      const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription('You do not have permission to run this command!')
      return message.channel.send({embeds: [embed]});
    }
    if (!message.member.voice.channel) {
      const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription('You are not connected to the same voice channel as Celeste!')
      return message.channel.send({embeds: [embed]});
    }
    const queue = distube.getQueue(message)
        if (!queue) {
          const embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setDescription(`There is nothing playing!`)
          return message.channel.send({embeds: [embed]});
        } else if (queue) {
          distube.shuffle(message);
          const embed = new Discord.MessageEmbed()
          .setColor('GREEN')
          .setDescription('Shuffled the queue!')
          return message.channel.send({embeds: [embed]});
        } else {
        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`There is nothing playing!`)
        return message.channel.send({embeds: [embed]});
      }
  },
};

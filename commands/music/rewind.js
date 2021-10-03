const Discord = require("discord.js");
module.exports = {
  name: 'rewind',
  description: 'Play music',
  aliases: '',
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
          if (!msgArr[1]) {
            const embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`You must specify an amount of seconds to rewind!`)
            return message.channel.send({embeds: [embed]});
          }
          try {
          let seektime = queue.currentTime - Number(msgArr[1]) * 1000;
          if(seektime < 0)
          seektime = 0;
          if(seektime >= queue.songs[0].duration * 1000 - queue.currentTime)
          seektime = 0;
        distube.seek(message, seektime)
        } catch (err) {
          return message.channel.send('Invalid time!');
        }
          const embed = new Discord.MessageEmbed()
          .setColor('GREEN')
          .setDescription(`Rewound \`${msgArr[1]}\` seconds!`)
          return message.channel.send({embeds: [embed]});
        } else {
        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`There is nothing playing!`)
        return message.channel.send({embeds: [embed]});
      }
  },
};

const Discord = require("discord.js");
module.exports = {
  name: 'repeat',
  description: 'Play music',
  aliases: 'loop',
  usage: 'play <music name>',
  admin: false,
  execute: async (client, message, config, distube) => {
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
    const msgArr = message.content.split(' ');
    const queue = distube.getQueue(message)
        if (!queue) {
          const embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setDescription(`There is nothing playing!`)
          return message.channel.send({embeds: [embed]});
        } else if (queue) {
        let mode = null
        switch (msgArr[1]) {
            case "off":
                mode = 0
                break
            case "song":
                mode = 1
                break
            case "queue":
                mode = 2
                break
        }
        mode = distube.setRepeatMode(message, mode)
        mode = mode ? mode === 2 ? "Repeat queue" : "Repeat song" : "Off"
        const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription(`Set repeat mode to \`${mode}\``)
        return message.channel.send({embeds: [embed]});
      } else {
        const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`There is nothing playing!`)
        return message.channel.send({embeds: [embed]});
      }
  },
};

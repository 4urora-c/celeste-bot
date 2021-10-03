const filterList = ['3D', 'Echo', 'Karaoke', 'Nightcore', 'Vaporwave', 'Bassboost', 'Flanger', 'Gate', 'Haas', 'Surround', 'Mcompand', 'Phaser', 'Tremolo', 'Earwax'];
const Discord = require("discord.js");
module.exports = {
  name: 'filters',
  description: 'bassboost music',
  aliases: filterList,
  usage: filterList.join('/'),
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
    const command = msgArr[0].slice(1);
    const queue = distube.getQueue(message)
    if (command.toLowerCase() === 'filters' && !msgArr[1]) {
      const embed = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setTitle('Filters')
      .setDescription(`${filterList.map((filter) => `${filter}`).join('\n')}`)
      message.channel.send({embeds: [embed]});
      return;
    }
    if(!queue) {
      const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`There is nothing in the queue right now!`)
      return message.channel.send({embeds: [embed]});
    }
    if(!msgArr[1]) return;
    if (msgArr[1] === "off" && queue.filter) {
      distube.setFilter(message, queue.filter)
      const embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription(`Filter has been disabled.`)
      return message.channel.send({embeds: [embed]});
    }
    try {
    const filter = distube.setFilter(message, msgArr[1].toLowerCase());
    const embed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setDescription(`Current queue filter: ${filter || 'Off'}`)
    return message.channel.send({embeds: [embed]});
  } catch(err) {
    const embed = new Discord.MessageEmbed()
    .setColor('RED')
    .setDescription('That is not a valid filter!')
    return message.channel.send({embeds: [embed]});
  }

  },
};

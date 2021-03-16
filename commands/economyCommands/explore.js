const Discord = require('discord.js');

module.exports = {
  name: 'explore',
  description: 'explore',
  aliases: [],
  usage: 'explore',
  execute: async (client, message, config) => {
    if (!config.explore) {
      message.channel.send('Explore amount not configured.');
      return;
    }
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    const amount = Math.floor(Math.random() * (config.explore.max - config.explore.min + 1) + config.explore.min);
    const embed = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setTitle('Explore')
      .setDescription(`✅ ${message.author} you got ${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}!`);
    message.channel.send({ embed });
    await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, { $inc: { coins: amount } }, { upsert: true });
  },
};
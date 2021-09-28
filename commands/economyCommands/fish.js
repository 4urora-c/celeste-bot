const Discord = require('discord.js');

module.exports = {
  name: 'fish',
  description: 'fish',
  aliases: [],
  usage: 'fish',
  execute: async (client, message, config) => {
    if (!config.fish) {
      message.channel.send('Fish amount not configured.');
      return;
    }
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    const guilddata2 = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (guilddata2.economy === 'false') return message.channel.send('Economy is disabled on this guild!');
    const amount = Math.floor(Math.random() * (config.fish.max - config.fish.min + 1) + config.fish.min);
    const embed = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setTitle('Fishing')
      .setDescription(`✅ ${message.author} you got ${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}!`);
    message.channel.send({ embeds: [embed] });
    await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, { $inc: { coins: amount } }, { upsert: true });
  },
};

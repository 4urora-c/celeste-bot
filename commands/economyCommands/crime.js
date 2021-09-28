const Discord = require('discord.js');

module.exports = {
  name: 'crime',
  description: 'hunt',
  aliases: [],
  usage: 'hunt',
  execute: async (client, message, config) => {
    console.log(config)
    if (!config.crime) {
      message.channel.send('Crime amount not configured.');
      return;
    }
    const guilddata2 = await client.db.config.findOne({
      id: message.guild.id,
    });
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    if (guilddata2.economy === 'false') return message.channel.send('Economy is disabled on this guild!');
    const amount = Math.floor(Math.random() * (config.crime.max - config.crime.min + 1) + config.crime.min);
    const loss = Math.round(Math.random());
    if (loss === 0) {
    const embed = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setTitle('Crime')
      .setDescription(`✅ ${message.author} you got ${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}!`);
      await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, { $inc: { coins: amount } }, { upsert: true });
      message.channel.send({ embeds: [embed] });
    } else if (loss === 1) {
      const embed = new Discord.MessageEmbed()
        .setColor('#c20000')
        .setTitle('Crime')
        .setDescription(`${message.author} you lost ${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}!`);
        await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, { $inc: { coins: -amount } }, { upsert: true });
        message.channel.send({ embeds: [embed] });
    }
  },
};

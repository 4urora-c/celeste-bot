const Discord = require('discord.js');

module.exports = {
  name: 'daily',
  description: 'fish',
  aliases: [],
  usage: 'fish',
  execute: async (client, message, config) => {
    if (!config.daily) {
      message.channel.send('Daily amount not configured.');
      return;
    }
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    const guilddata2 = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (guilddata2.economy === 'false') return message.channel.send('Economy is disabled on this guild!');
    const amount = config.daily.amount;
    const embed = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setTitle('Daily')
      .setDescription(`✅ ${message.author} you got ${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}. See you again tomorrow!`);
    message.channel.send({ embeds: [embed] });
    await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, { $inc: { coins: amount } }, { upsert: true });
  },
};

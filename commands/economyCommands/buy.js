const Discord = require('discord.js');

module.exports = {
  name: 'servershopbuy',
  description: 'show buy items',
  aliases: 'ssbuy',
  usage: 'buy',
  execute: async (client, message, config) => {
    const guilddata2 = await client.db.config.findOne({
      id: message.guild.id,
    });
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    if (guilddata2.economy === 'false') return message.channel.send('Economy is disabled on this guild!');
    if (config.shop) {
      const msgArr = message.content.split(' ');
      if (!msgArr[1]) {
        message.channel.send('Please indicate the item you want to purchase!');
        return;
      }

      const itemName = message.content.slice(message.content.indexOf(' ') + 1);
      const item = config.shop[itemName];
      if (!item) return message.channel.send('That is an invalid item!');

      const userdata = await client.db.userdata.findOne({ id: message.author.id, guildID: message.guild.id });
      if (userdata.coins < item.price) {
        const embed = new Discord.MessageEmbed()
        .setColor('#c90000')
        .setDescription(`You don't have enough ${guilddata.currencyname ? guilddata.currencyname : 'Bells'} to do this!`)
        message.channel.send({embeds: [embed]});
        return;
      }

      await client.db.userdata.updateOne({ id: message.author.id, guildID: message.guild.id }, {
        $inc: {
          coins: item.price * -1,
        },
      });

      if(config.channels.purchaselog) {
        const embed = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`${message.member} bought ${item.emote}${itemName}`)
        .setFooter(`${message.guild}'s server shop `)
        .setTimestamp();
        client.channels.cache.get(config.channels.purchaselog).send({embeds: [embed]});
      }

      const embed = new Discord.MessageEmbed()
        .setColor('#00c914')
        .setTitle('Successful purchase!')
        .setDescription(`You have successfully bought ${item.emote ? item.emote : ''}**${item.name}** for ${item.price} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`);

      message.channel.send({embeds: [embed]});
    }
  },
};

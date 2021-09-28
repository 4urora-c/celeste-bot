const Discord = require('discord.js');

module.exports = {
  name: 'servershop',
  description: 'show shop items',
  aliases: 'ss',
  usage: 'shop',
  execute: async (client, message, config) => {
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    const guilddata2 = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (guilddata2.economy === 'false') return message.channel.send('Economy is disabled on this guild!');
    if (config.shop) {
        const embed = new Discord.MessageEmbed()
          .setTitle('Server Shop')
          //.setDescription(itemList.join('\n\n'))
          .setFooter(';servershopbuy <item>')
          const itemList = Object.keys(config.shop)
          .sort((a, b) => {
            if (config.shop[a].price > config.shop[b].price) return -1;
            if (config.shop[a].price < config.shop[b].price) return 1;
            return 0;
           })
           itemList.forEach(itemName => {
             const item = config.shop[itemName];
             embed.addField(`${item.emote ? `${item.emote} ` : ''}${itemName}`,
            `${item.description ? item.description : ''} \n **Price**: ${item.price} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}\n** **`)
           })
          /* .map((itemName) => {
            const item = config.shop[itemName];
            `${item.emote ? `${item.emote} ` : ''}${itemName} \r\n Price: ${item.price} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'} `;
          }); */
          message.channel.send({embeds: [embed]});
        } else {
      const embed = new Discord.MessageEmbed()
      .setTitle('Server Shop')
      .setDescription('There are no items in the shop!');
      message.channel.send({embeds: [embed]});
    }
  },
};

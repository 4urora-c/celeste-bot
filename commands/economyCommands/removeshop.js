module.exports = {
  name: 'removeshop',
  description: 'show removeshop items',
  aliases: 'shopremove',
  usage: 'removeshop',
  execute: async (client, message, config) => {
    if (message.member.id !== '620196347890499604' && !message.member.permissions.has('ADMINISTRATOR')) { return message.reply('You\'re not allowed to use this command!');}
    const guilddata = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (guilddata.economy === 'false') return message.channel.send('Economy is disabled on this guild!');
    const msgArr = message.content.split(' ');
    if (msgArr[1] && config.shop) {
      const item = config.shop[msgArr.slice(1).join(' ')];
      if (item) {
        delete config.shop[msgArr.slice(1).join(' ')];
        client.db.config.updateOne({ id: message.guild.id }, {
          $set: {
            shop: config.shop,
          },
        });
      }
      message.channel.send(`Successfully deleted **${msgArr.slice(1).join(' ')}** from shop!`);
    }
  },
};

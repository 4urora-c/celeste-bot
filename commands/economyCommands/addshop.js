module.exports = {
  name: 'addshop',
  description: 'show addshop items',
  aliases: 'shopadd',
  usage: 'addshop',
  execute: async (client, message, config) => {
    if (message.author.id !== '620196347890499604' && !message.member.permissions.has('ADMINISTRATOR')) { message.reply('You\'re not allowed to use this command!'); return; }
    const guilddata = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (guilddata.economy === 'false') return message.channel.send('Economy is disabled on this guild!');
    const msgArr = message.content.split(' ');
    const args = msgArr.slice(1).join(' ').split(', ');
    if (args.length === 4) {
      const price = parseInt(args[0], 10);
      if (isNaN(price)) {
        message.channel.send('Enter a valid price!');
        return;
      }
      if (!config.shop) {
        config.shop = {};
      }
      config.shop[args[1]] = {
        name: args[1],
        price,
        emote: args[2],
        description: args[3]
      };
      client.db.config.updateOne({ id: message.guild.id }, {
        $set: {
          shop: config.shop,
        },
      });
      message.channel.send(`Successfully added **${args[1]}** to shop!`);
    } else {
      message.channel.send('Insufficient arguments! Expected usage: `;addshop <price>, <name>, <emote>, <description>`');
    }
  },
};

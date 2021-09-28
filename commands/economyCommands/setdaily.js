module.exports = {
  name: 'setdaily',
  description: 'setexplore',
  aliases: [],
  usage: 'setexplore',
  execute: async (client, message, config) => {
    if (message.author.id !== '620196347890499604' && !message.member.permissions.has('ADMINISTRATOR')) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    if (!msgArr[1]) {
      message.channel.send('Configure daily amount first using ;setdaily <amount>');
      return;
    }
    const amount = parseInt(msgArr[1], 10);
    if (isNaN(amount)) {
      message.channel.send('Daily value must be an integer!');
      return;
    }
    config.daily = { amount };
    await client.db.config.updateOne({ id: message.guild.id }, { $set: { daily: config.daily } }, { upsert: true });
    message.channel.send('Settings have been successfully applied!');
  },
};

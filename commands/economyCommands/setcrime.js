module.exports = {
  name: 'setcrime',
  description: 'setexplore',
  aliases: [],
  usage: 'setexplore',
  execute: async (client, message, config) => {
    if (message.author.id !== '620196347890499604' && !message.member.permissions.has('ADMINISTRATOR')) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    if (!msgArr[1]) {
      message.channel.send('Configure crime amount first using ;setcrime min-max');
      return;
    }
    const rangeArr = msgArr[1].split('-');
    const min = parseInt(rangeArr[0], 10);
    const max = parseInt(rangeArr[1], 10);
    if (isNaN(min) || isNaN(max)) {
      message.channel.send('Min and max must be integers!');
      return;
    }
    config.crime = { min, max };
    await client.db.config.updateOne({ id: message.guild.id }, { $set: { crime: config.crime } }, { upsert: true });
    message.channel.send('Settings have been successfully applied!');
  },
};

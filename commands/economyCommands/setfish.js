module.exports = {
  name: 'setfish',
  description: 'setfish',
  aliases: [],
  usage: 'setfish',
  execute: async (client, message, config) => {
    if (!message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.permissions.has('ADMINISTRATOR'))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    if (!msgArr[1]) {
      message.channel.send('Configure fish amount first using ;setfish min-max');
      return;
    }
    const rangeArr = msgArr[1].split('-');
    const min = parseInt(rangeArr[0], 10);
    const max = parseInt(rangeArr[1], 10);
    if (isNaN(min) || isNaN(max)) {
      message.channel.send('Min and max must be integers!');
      return;
    }
    message.channel.send('Settings have been successfully applied!');
    config.fish = { min, max };
    await client.db.config.updateOne({ id: message.guild.id }, { $set: { fish: config.fish } }, { upsert: true });
  },
};

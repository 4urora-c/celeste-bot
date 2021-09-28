module.exports = {
  name: 'description',
  description: 'show addshop items',
  aliases: 'shopdesc',
  usage: 'addshop',
  execute: async (client, message, config) => {
    if (message.author.id !== '620196347890499604' && !message.member.permissions.has('ADMINISTRATOR')) { message.reply('You\'re not allowed to use this command!'); return; }
    const guilddata = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (guilddata.economy === 'false') return message.channel.send('Economy is disabled on this guild!');
    const msgArr = message.content.split(' ');
    const args = msgArr.slice(1).join(' ').split(', ');
    console.log(args);
  },
};

/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-len */

module.exports = {
  name: 'setprefix',
  description: 'setprefix',
  aliases: 'sp',
  usage: 'setprefix <newprefix>',
  execute: async (client, message, config) => {
    if (message.author.id !== '620196347890499604' && !message.member.permissions.has(['ADMINISTRATOR'])) { return message.reply('You\'re not allowed to use this command!'); }

    const msgArr = message.content.split(' ');
    const newPrefix = msgArr[1] ? msgArr[1][0] : null;
    if (!newPrefix) {
      message.channel.send('You must provide the new prefix!');
      return;
    }

    client.db.config.updateOne({ id: message.guild.id },
      {
        $set: {
          prefix: newPrefix,
        },
      });

    config.prefix = newPrefix;
    message.channel.send(`You have changed your prefix to \`${newPrefix}\`!`);
  },
};

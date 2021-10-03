/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'reset',
  description: 'remove user data',
  execute: async (client, message, config) => {
    if (message.author.id === "620196347890499604") {

    const msgArr = message.content.split(' ');
    const user = message.mentions.users.first() || client.users.cache.get(msgArr[1]);
    if (user) {
      const userdata = await client.db.islandinfo.findOne({ id: user.id });
      if (userdata) {
        client.db.islandinfo.removeOne({ id: user.id });
        message.channel.send(`${user}'s island info has been removed!`);
      } else {
        message.channel.send('Specified user doesn\'t have any island info!');
      }
    } else {
      message.channel.send('You must indicate a user!');
    }
  } else {
    message.channel.send('You do not have permission to run this command.');
  }
  },
};

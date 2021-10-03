/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'is',
  aliases: 'island',
  description: 'get user info',
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    const user = message.mentions.users.first() || client.users.cache.get(msgArr[1]) || message.author;
    if (user) {
      const userdata = await client.db.islandinfo.findOne({ id: user.id });
      if (userdata) {
        const embed = new MessageEmbed()
          .setTitle('User Info')
          .setAuthor(user.tag, user.avatarURL())
          .setThumbnail(user.avatarURL());

        if (userdata.name) {
          embed.addField('Name', userdata.name);
        }
        if (userdata.moreinfo) {
          userdata.moreinfo.sort((a, b) => {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
          }).forEach((info) => {
            embed.addField(info.name, info.description);
          });
        }
        if (userdata.alts) {
          embed.addField('Alt Account', userdata.alts);
        }
        message.channel.send({embeds: [embed]});
      } else {
        message.channel.send('Specified user doesn\'t have any island info!');
      }
    } else {
      message.channel.send('You must indicate a user!');
    }
  },
};

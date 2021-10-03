/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const Discord = require('discord.js');

module.exports = {
  name: 'name',
  description: 'name',
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    const userdata = await client.db.islandinfo.findOne({ id: message.member.id });
    if (msgArr[1]) {
      if (msgArr.slice(1).join(' ').length > 10) {
        return message.channel.send('This name is too long!')
      }
      client.db.islandinfo.updateOne(
        { id: message.author.id },
        {
          $set: {
            name: msgArr.slice(1).join(' '),
          },
        },
        { upsert: true },
      );
      try {
        if (userdata.moreinfo[0].name === 'Island' && guilddata.friendcoderequirement === 'false') {
          message.member.roles.add(guilddata.moreinfo[0].description);
        } else if (userdata.moreinfo[1].name === 'Island' && guilddata.friendcoderequirement === 'false') {
          message.member.roles.add(guilddata.moreinfo[1].description);
        }
      } catch (err) {
        console.log(`Missing island info for ${message.author.tag} or server does not have role set.`);
      }
      const embedA = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`Your name has been set to **${msgArr.slice(1).join(' ')}**!`);
      message.channel.send({ embeds: [embedA] });
    } else {
      message.channel.send('You must provide a name!');
    }
  },
};

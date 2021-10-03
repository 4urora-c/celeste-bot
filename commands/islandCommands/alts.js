/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const Discord = require('discord.js');

module.exports = {
  name: 'alts',
  description: 'alternate account info',
  aliases: 'alt',
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    const userdata = await client.db.islandinfo.findOne({ id: message.member.id });
    if (msgArr[1]) {
      if (msgArr.slice(1).join(' ').length > 37) {
        return message.channel.send('This account name is too long!')
      }
      client.db.islandinfo.updateOne(
        { id: message.author.id },
        {
          $set: {
            alts: msgArr.slice(1).join(' '),
          },
        },
        { upsert: true },
      );
      const embedA = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`Your alternate account username has been set to **${msgArr.slice(1).join(' ')}**!`);
      message.channel.send({ embeds: [embedA] });
    } else {
      message.channel.send('You must provide a username!');
    }
  },
};

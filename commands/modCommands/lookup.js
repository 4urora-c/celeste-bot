/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
const Discord = require("discord.js");
module.exports = {
  name: 'lookup',
  aliases: 'li',
  description: 'lookup',
  execute: async (client, message, config) => {
    const msgArr = message.content.split(' ');
    try {
    if(message.author.id === '620196347890499604' || message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id)) || message.member.permissions.has('ADMINISTRATOR')) {
    const list = await client.db.islandinfo.find().toArray();
    if (!msgArr[1]) {
      message.channel.send('You must provide a name!');
      return;
    }
    const username = msgArr[1];
    const matches = [];
    list.forEach((member) => {
      if (member.name) {
        if (member.name.toLowerCase().includes(username.toLowerCase())) {
          const userdata = message.guild.members.cache.get(member.id);
          const usertag = userdata ? userdata.user.tag : 'Unknown User';
          let userdatastring = '';
          let islandstring = '';
          userdatastring += `| **Name**: ${member.name} `;
          if (member.moreinfo) {
            const fc = member.moreinfo.find((u) => u.name === 'Friend Code');
            const is = member.moreinfo.find((u) => u.name === 'Island');
            islandstring += is ? ` | **Island**: ${is.description} ` : ' No island name ';
            userdatastring += `${islandstring} ${fc ? `| **Friend Code**: ${fc.description} ` : '| Friend Code: None '}`;
          }
          try {
          matches.push(`> ${usertag} ${userdatastring} ${member.alts ? ` | Alt: ${member.alts}` : ' | No alt registered.'}`);
        } catch (err) {
          console.log(err.stack);
        }
        }
      }
    });
    const listEmbed = new Discord.MessageEmbed();
    listEmbed.addField('Lookup Matches', `${matches.slice(0, 30).join('\n')}`);
    message.channel.send({embeds: [listEmbed]}).catch((error) => {
      message.channel.send('There are too many matches to display.');
    });
  } else {
    message.channel.send('You do not have permission to run this command.');
  }
} catch(err) {
  message.channel.send('No matches found.')
}

  },
};

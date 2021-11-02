/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
data: new SlashCommandBuilder()
  .setName('lookup')
  .setDescription('Looks up character name from Celeste database')
  .setDefaultPermission(false)
  .addStringOption(option =>
    option
      .setName('username')
      .setDescription('The character name to look up')
      .setRequired(true)),
  async execute (interaction) {
    try {
    const list = await interaction.client.db.islandinfo.find().toArray();

    const username = interaction.options.getString('username');
    const matches = [];
    list.forEach((member) => {
      if (member.name || member.altname) {
        if (member.name?.toLowerCase().includes(username.toLowerCase()) || member.altname?.toLowerCase().includes(username.toLowerCase())) {
          const userdata = interaction.guild?.members.cache.get(member.id);
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
          if (member.altname) {
            let altland = '';
            if (member.altinfo) {
              altland = member.altinfo.find((u) => u.name === 'Island');
            }
            userdatastring += `| **Alt Name**: ${member.altname} | **Alt Island**: ${altland.description}`
          }
          try {
          matches.push(`> ${usertag} ${userdatastring}`);
        } catch (err) {
          console.log(err.stack);
        }
        }
      }
    });
    const listEmbed = new Discord.MessageEmbed();
    listEmbed.addField('Lookup Matches', `${matches.slice(0, 30).join('\n')}`);
    interaction.reply({embeds: [listEmbed]}).catch((error) => {
      interaction.reply('There are too many matches to display.');
    });
} catch(err) {
  console.log(err.stack)
  interaction.reply('No matches found.')
}

  },
};

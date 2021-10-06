/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('island')
    .setDescription('Check island info with this command')
    .setDefaultPermission(false)
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The user whose info you want to check')),
  async execute(interaction)  {
    const user = interaction.options.getUser('target');
    if (user) {
      const userdata = await interaction.client.db.islandinfo.findOne({ id: user.id });
      if (userdata) {
        const embed = new MessageEmbed()
          .setTitle('User Info')
          .setAuthor(user.tag, user.displayAvatarURL())
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
                interaction.reply({embeds: [embed]});
      }
      } else if (!user) {
        const userdata = await interaction.client.db.islandinfo.findOne({ id: interaction.member.id });
        if (userdata) {
          const embed = new MessageEmbed()
            .setTitle('User Info')
            .setAuthor(interaction.member.user.tag, interaction.member.user.displayAvatarURL())
            .setThumbnail(interaction.member.user.avatarURL());

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
          interaction.reply({embeds: [embed]});
        }
      } else {
        interaction.reply({content: 'Specified user doesn\'t have any island info!'});
      }
    }
}

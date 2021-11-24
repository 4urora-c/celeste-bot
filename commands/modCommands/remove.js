/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetinfo')
    .setDescription('Reset info with this command')
    .setDefaultPermission(false)
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The user whose info you want to reset')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const user = interaction.guild?.members.cache.get(interaction.options.getUser('target').id);
      const userdata = await interaction.client.db.islandinfo.findOne({ id: user.id });
      if (userdata) {
        await interaction.client.db.islandinfo.removeOne({ id: user.id });
        return await interaction.editReply(`${user.user.tag}'s island info has been removed!`);
      } else {
        return await interaction.editReply('Specified user doesn\'t have any island info!');
      }
  },
};

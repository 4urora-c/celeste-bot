/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');
const perms = require('../utils/permissions')
const { client } = require('../index.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('DANGER: Refreshes client permissions! Use only if necessary.'),
    //.setDefaultPermission(false),
  async execute(interaction) {
    if (interaction.member.id !== interaction.guild.ownerId) return interaction.reply('You can\'t do that!')
    await interaction.deferReply();
    await perms.refreshCommandPermissionsClient(interaction.client)
    await interaction.editReply('Client permissions have been refreshed')
  }
};

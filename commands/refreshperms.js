/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');
const perms = require('../utils/permissions')
const { client } = require('../index.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('refresh')
    .setDescription('DANGER: Refreshes client permissions! Use only if necessary.')
    .addStringOption(option =>
      option
        .setName('target')
        .setDescription('The target command(s) to refresh')
        .setRequired(true)),
    //.setDefaultPermission(false),
  async execute(interaction) {
    if (interaction.member.id !== interaction.guild.ownerId) return interaction.reply('You can\'t do that!')
    await interaction.deferReply();
    const commands = interaction.options.getString('target')
    if (commands === 'all') {
    await perms.refreshCommandPermissionsClient(interaction.client)
  } else {
    try {
      await perms.refreshCommandPermissionsSpecific(interaction.client, commands)
    } catch(err) {
      return await interaction.editReply('Command doesn\'t exist!')
    }
  }
    await interaction.editReply('Client permissions have been refreshed')
  }
};

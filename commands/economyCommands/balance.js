/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance with this command!')
    .setDefaultPermission(false)
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The user whose balance you want to check')),
  async execute (interaction) {
    const target = interaction.options.getUser('target')
    const guilddata = await interaction.client.db.config.findOne({
      id: interaction.guild.id,
    });
    if (!guilddata.economy || guilddata.economy === 'true') {
    const guilddata = await interaction.client.db.islandinfo.findOne({ guildid: interaction.guild.id });
    const user = target ? target : interaction.member
    const userdata = await interaction.client.db.userdata.findOne({ id: user.id, guildID: interaction.guild.id });
    if (userdata) {
      const embed = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setDescription(`${user} has ${userdata.coins} ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!`);
      interaction.reply({embeds: [embed]});
    } else {
      return interaction.reply({content: 'Your profile has not been generated yet.'} );
    }
  } else {
    return interaction.reply({content: 'Economy is disabled on this guild!'} );
  }
  },
};

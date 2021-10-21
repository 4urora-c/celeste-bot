const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
      .setName('setcolour')
      .setDescription('Get a custom colour role!')
      .addStringOption(option =>
        option
          .setName('hex')
          .setDescription('The hex code for your colour role')
          .setRequired(true))
      .setDefaultPermission(false),
  async execute (interaction) {
    if(interaction.member.roles.cache.some(r => r.name === interaction.member.id)) {
      const role = interaction.guild.roles.cache.find(x => x.name === interaction.member.id);
      await interaction.deferReply()
      role.edit({color: interaction.options.getString('hex')}).catch(console.error)
      interaction.editReply('Your colour role has been edited!')
    } else {
      const role = interaction.guild.roles.cache.find(x => x.name === interaction.member.id);
      if (!role) {
        await interaction.deferReply()
        interaction.guild.roles.create({
          name: interaction.member.id,
          color: interaction.options.getString('hex'),
          position: 76
        }).catch(interaction.editReply(console.error))
        interaction.editReply('A colour role has been added to you!')
      } else {
        await interaction.deferReply()
        role.edit({color: interaction.options.getString('hex')}).catch(interaction.editReply(console.error))
        interaction.member.roles.add(role)
        interaction.editReply('Your colour role has been edited and added to you!')
      }
    }

  },
};

const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const namedColors = require('color-name-list')
module.exports = {
    data: new SlashCommandBuilder()
      .setName('setcolour')
      .setDescription('Get a custom colour role!')
      .addStringOption(option =>
        option
          .setName('colour')
          .setDescription('The hex code for your colour role')
          .setRequired(true))
      .setDefaultPermission(false),
  async execute (interaction) {
    await interaction.deferReply()

    let colour = interaction.options.getString('colour')

    if (!colour.includes('#')) {
      const coloured = namedColors.find(c => c.name.toLowerCase().split(' ').join('') === colour.toLowerCase().split(' ').join(''))

      if(!coloured) {
        return interaction.editReply('Could not find the colour you\'re looking for! If you\'re trying to use a hex code, remember to add the #')
      }

      colour = coloured.hex
      console.log(coloured)
    }

    if(interaction.member?.roles.cache.some(r => r.name === interaction.member.id)) {
      const role = interaction.guild.roles.cache.find(x => x.name === interaction.member.id);
      try {
      role.edit({color: colour}).catch(console.error)
    } catch(e) {
      return interaction.editReply('This colour does not exist!')
    }
      interaction.editReply('Your colour role has been edited!')
    } else {
      const role = interaction.guild?.roles.cache.find(x => x.name === interaction.member.id);
      if (!role) {
        try {
        const create = await interaction.guild.roles.create({
          name: interaction.member.id,
          color: colour,
          position: interaction.guild.roles.cache.find(x => x.name.toLowerCase() === 'supporter').position + 1
        }).catch(console.error)
        interaction.member.roles.add(create)
      } catch(e) {
        return interaction.editReply('This colour does not exist!')
      }
        interaction.editReply('A colour role has been added to you!')
      } else {
        try {
        role.edit({color: colour}).catch(console.error)
      } catch(e) {
        return interaction.editReply('This colour does not exist!')
      }
        interaction.member.roles.add(role)
        interaction.editReply('Your colour role has been edited and added to you!')
      }
    }

  },
};

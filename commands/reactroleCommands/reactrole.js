/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactrole')
    .setDescription('Add your information to the Celeste database')
    .setDefaultPermission(false)
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('The name of the embed')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('The description for the embed')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('colour')
        .setDescription('The colour of the embed'))
    .addStringOption(option =>
      option
        .setName('footer')
        .setDescription('The footer for the embed')),
  execute: async (interaction) => {
    if (interaction.member.id !== '620196347890499604' && !interaction.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || interaction.member.permissions.has(['ADMINISTRATOR']))) { return interaction.reply('You\'re not allowed to use this command!'); }
    let name = interaction.options.getString('name');
    let description = interaction.options.getString('description')
    let colour = interaction.options.getString('colour')
    let footer = interaction.options.getString('footer')
    const embed = new MessageEmbed()
      .setTitle(name)
      .setDescription(description)
      if (colour) {
        try {
        await embed.setColor(colour.toUpperCase())//.catch((err) => {
          /*if (args[1].length > 7) {
            console.log(err)
            return message.channel.send('That is not a valid colour!');
          }
        })*/} catch(err) {
        return interaction.reply('Invalid embed colour selected')
      }
      }
      if (footer) {
        try {
        await embed.setFooter(footer)
      } catch(err) {
        console.log(err)
        return interaction.reply('There was an error while creating the embed footer.');
      }
      }
    const reactMessage = await interaction.channel.send({embeds: [embed]});
    interaction.reply({ content: 'Embed created!', ephemeral: true })

    const guildRole = interaction.client.reactrolelocal.find((roleGuild) => roleGuild.id === interaction.guild.id);

    if (!guildRole) {
      interaction.client.reactrolelocal.push({
        id: reactMessage.id,
        roles: {},
      });
    } else {
      guildRole[reactMessage.id] = {
        roles: {},
      };
    }

    interaction.client.db.reactrole.updateOne(
      { id: reactMessage.id },
      {
        $set: {
          roles: {},
        },
      },
      { upsert: true },
    );
  },
};

/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionrole')
    .setDescription('Make a reactrole message')
    .setDefaultPermission(false)
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('title of embed')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('color')
        .setDescription('hex color of embed')
        .setRequired(false))
    .addStringOption(option =>
      option
        .setName('footer')
        .setDescription('footer of embed')
        .setRequired(false)),
  async execute(interaction) {
    let title = interaction.options.getString('title');
    const color = interaction.options.getString('color');
    const footer = interaction.options.getString('footer');
    // if (message.author.id !== '620196347890499604' && !message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.permissions.has(['ADMINISTRATOR']))) { return message.reply('You\'re not allowed to use this command!'); }
    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription('React to a reaction to get the role!\n\n');
    if (color) {
      try {
        embed.setColor(color.toUpperCase());
      } catch (err) {
        if (color.length > 7) {
          console.log(err)
          await interaction.reply({ content: 'That is not a valid colour!', ephemeral: true });
          return;
        }
      }
    }
    if (footer) {
      try {
        embed.setFooter(footer);
      } catch (err) {
        console.log(err)
        await interaction.reply({ content: 'There was an error while creating the embed footer.', ephemeral: true });
      }
    }

    let reactId;
    await interaction.reply({ embeds: [embed], fetchReply: true }).then(i => reactId = i.id);

    const guildRole = interaction.client.reactrolelocal.find((roleGuild) => roleGuild.id === interaction.guild.id);
    if (!guildRole) {
      interaction.client.reactrolelocal.push({
        id: reactId,
        roles: {},
      });
    } else {
      guildRole[reactId] = {
        roles: {},
      };
    }

    interaction.client.db.reactrole.updateOne(
      { id: reactId },
      {
        $set: {
          roles: {},
        },
      },
      { upsert: true },
    );
  },
};

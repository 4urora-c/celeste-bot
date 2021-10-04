/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('banslash')
    .setDescription('Bans the user')
    .setDefaultPermission(false)
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to ban.')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('The reason for the ban.')
        .setRequired(false)),
  async execute(interaction) {
    // if (interaction.user.id !== '620196347890499604' && !interaction.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.permissions.has(['ADMINISTRATOR']))) { return message.reply('You\'re not allowed to use this command!'); }
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user);
    if (!member.bannable) { interaction.reply({ content: 'You can\'t ban that member!', ephemeral: true }); }
    else {
      let reason = interaction.options.getString('reason');
      let description = `**${member.user.tag}** was banned by **${interaction.user}**`;
      let reasonText = ``
      if(reason) {
        description += ` for '**${reason}**'`;
        reasonText = ` for '**${reason}**'`;
      }
      
      if (interaction.member.id === '620196347890499604') {
        try {
          await member.send(`You have been banned from '**${interaction.guild}**' by **${interaction.member.user.tag}**${reasonText}. This ban is administrative and cannot be appealed. Thank you for being a member at **Polaris**.`);
        } catch (err) { }
        await member.ban({ reason: reason });
        const embed = new Discord.MessageEmbed()
          .setColor('RED')
          .setDescription(description);
        await interaction.reply({ embeds: [embed] });
        return;
      }
      try {
        await member.send(`You have been banned from '**${interaction.guild}**' by **${interaction.member.user.tag}**${reasonText}. If you would like to appeal your ban, please DM them directly. If their DMs are closed or they are not accepting friend requests, please message <@384920723212468225>.`);
      } catch (err) { }
      await member.ban({ reason: reason })
        .catch((error) => interaction.reply(`There was an error ${interaction.user}! Error: ${error}`));
      
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(description);
      await interaction.reply({ embeds: [embed] });
    }
  }
};

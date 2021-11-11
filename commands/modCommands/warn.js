/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns the user')
    .setDefaultPermission(false)
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to warn.')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('The reason for the warn.')
        .setRequired(false)),
  async execute(interaction) {
    let targetUser = interaction.options.getUser('user')
    let reason = interaction.options.getString('reason')
    if (targetUser.id === '620196347890499604' || targetUser.id === interaction.member.id) {
      return interaction.reply('You cannot warn this user!')
    } else {
    if (!reason || reason === '') reason = 'Unknown';
    const currentDate = Date.now();
    const user = await interaction.client.db.warn.findOne({ id: targetUser.id }) || { warns: [] };
    const modData = await interaction.client.db.modstats.findOne({ id: interaction.member.id }) || {};
    const modWarns = modData.warns || [];
    user.warns.filter((warn) => currentDate - warn.date <= interaction.cient.db.config.warnexpiration);
    user.warns.push({
      reason,
      date: currentDate,
      mod: interaction.member.tag,
    });
    modWarns.push({
      user: targetUser.id,
      reason,
      date: currentDate,
    });


    if (user.warns.length === 3) {
    targetUser.send(`You have been warned!\nReason: **${reason}**. Please note that this is your third and final warning.`).catch();
  } else if (user.warns.length > 3){
    if (targetUser.bannable && !targetUser.roles.cache.some((r) => interaction.client.db.config.permissions.moderation.includes(r.id))) {
      targetUser.send(`You have been banned from **${interaction.guild.name}** for accumulating 4 warnings. \nThe reason for the ban is **${reason}**. To appeal this ban, please DM **${interaction.member.user.tag}** directly. Thank you for being a part of our community.`);
      targetUser.ban();
      const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`**${targetUser.user.tag}** has been banned for **${reason}**`)
      return interaction.reply({embeds: [embed]});
    } else {
      return interaction.reply('This user cannot be banned!')
    }
  } else {
    targetUser.send(`You have been warned!\nReason: **${reason}**.`).catch();
  }
    interaction.reply(`**${targetUser.user.tag}** has been warned! User currently has **${user.warns.length} active warnings**!`);

    await interaction.client.db.warn.updateOne({ id: targetUser.id, guildID: interaction.guild.id }, { $set: { warns: user.warns } }, { upsert: true });
    await interaction.client.db.modstats.updateOne({ id: interaction.member.id }, { $set: { warns: modWarns } }, { upsert: true });
  }
  },
};

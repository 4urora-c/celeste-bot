/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Check alt info with this command')
    .setDefaultPermission(false)
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Warns the user')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('The user who you want to warn')
            .setRequired(true))
        .addStringOption(option =>
          option
            .setName('reason')
            .setDescription('The reason for the warn.')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('check')
        .setDescription('Remove someone\'s warn(s)')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('The user to check warns for')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('clear')
        .setDescription('Remove someone\'s warn(s)')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('The user to remove warn(s) from')
            .setRequired(true))
        .addIntegerOption(option =>
            option
              .setName('index')
              .setDescription('The index of the warn you are clearing')
              .setRequired(false))),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'add') {
    let mem = interaction.options.getUser('user')
    let targetUser = await interaction.guild.members.fetch(mem);
    let reason = interaction.options.getString('reason')
    if (targetUser.id === '620196347890499604' || targetUser.id === interaction.member.id) {
      return interaction.reply('You cannot warn this user!')
    } else {
    if (!reason || reason === '') reason = 'Unknown';
    const currentDate = Date.now();
    const user = await interaction.client.db.warn.findOne({ id: targetUser.id }) || { warns: [] };
    const modData = await interaction.client.db.modstats.findOne({ id: interaction.member.id }) || {};
    const modWarns = modData.warns || [];
    user.warns.filter((warn) => currentDate - warn.date <= interaction.client.db.config.warnexpiration);
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
} else if (interaction.options.getSubcommand() === 'clear') {
  let mem = interaction.options.getUser('user')
  let clearUser = await interaction.guild.members.fetch(mem);
  let index = interaction.options.getInteger('index')
  if (!index) {
    clear = await interaction.client.db.warn.findOneAndDelete({id: clearUser.id, guildID: interaction.guild.id },
      {
    });
    const embed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setDescription(`All warns cleared for **${clearUser.user.tag}**.`)
    return interaction.reply({embeds: [embed]})
  } else if (index) {
    let clearUser2 = await interaction.client.db.warn.findOne({ id: clearUser.id }) || { warns: [] };
      let indVal = index-1;
      specClear = await interaction.client.db.warn.findOneAndUpdate({id: clearUser.id, guildID: interaction.guild.id }, {
        $pull: {
          warns: clearUser2.warns[indVal]
        }
      }, { upsert: true });
      const embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription(`Warn ${indVal+1} cleared for **${clearUser.user.tag}**.`)
      return interaction.reply({embeds: [embed]})
  }
} else if (interaction.options.getSubcommand() === 'check') {
  const currentDate = Date.now();
  let targetUserPre = interaction.options.getUser('user')
  let targetUser = await interaction.guild.members.fetch(targetUserPre)
  let user = await interaction.client.db.warn.findOne({ id: targetUser.id });
  if (user) {
    if (user.warns.length > 0) {
      const embed = new Discord.MessageEmbed()
      .setDescription(`**${targetUser.user.tag}'s Active Warnings:**\n\`\`\`\n\n${user.warns.map((warn, index) => {
        const warnDate = new Date(warn.date);
        return `${index + 1}) at ${warnDate.getUTCMonth() + 1}/${warnDate.getUTCDate()}/${warnDate.getUTCFullYear()} for ${warn.reason}.`;
      }).join('\n')}\`\`\`\n\nTo remove warnings, do **;warns clear <user> [index]**`)
      return interaction.reply({embeds: [embed]})}
    } else {
      const embed = new Discord.MessageEmbed()
      .setDescription(`**${targetUser.user.tag} doesn't have any active warnings.**`)
      .setColor('GREEN')
      interaction.reply({embeds: [embed]});
    }
}
  },
};

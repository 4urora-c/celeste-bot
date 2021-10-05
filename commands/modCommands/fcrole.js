/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('friendcoderole')
    .setDescription('Sets the role obtained by setting information')
    .addRoleOption(option =>
      option
        .setName('target')
        .setDescription('The target role to configure as fcrole')
        .setRequired(true)),
  async execute(interaction) {
    const guild = await interaction.client.db.islandinfo.findOne({ guildid: interaction.guild.id });
    const ar = interaction.options.getRole('target')
    const name = 'roleinfo';
    let description = ar;
    if (ar) {
    let item = ar.id
    if (guild) {
      if (guild.moreinfo) { item = guild.moreinfo.find((entry) => entry.name === name); }
    }
    if (item) {
      item.description = item;
      const moreinfo = item;
      const embedA = new Discord.MessageEmbed()
    .setColor('#5b4194')
    .setDescription(`Guild role has been set to **${ar}**!`);
    interaction.reply({embeds: [embedA]});
      interaction.client.db.islandinfo.updateOne(
        { guildid: interaction.guild.id },
        {
          $set: {
            moreinfo: guild.moreinfo,
          },
        },
        { upsert: true },
      );
    } else {
      interaction.client.db.islandinfo.updateOne(
        { guildid: interaction.guild.id },
        {
          $push: {
            moreinfo: {
              name,
              description,
            },
          },
        },
        { upsert: true },
      );
    const embedA = new Discord.MessageEmbed()
    .setColor('#7cdda5')
    .setDescription(`Guild role has been set to ${ar}`);
    interaction.reply({embeds: [embedA]});
    }
  }
}
};

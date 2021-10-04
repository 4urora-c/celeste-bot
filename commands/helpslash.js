const { SlashCommandBuilder } = require('@discordjs/builders');
const choices = [['Basic', 'Basic'], ['Lookup', 'Lookup'], ['Misc', 'Misc'], ['Giveaway', 'Giveaway'], ['Economy', 'Economy'], 
  ['Gambling', 'Gambling'], ['Music', 'Music'], ['Moderation', 'Moderation'], ['Memes', 'Memes'], ['Roleplay', 'Roleplay'], ['Econfig', 'Econfig'], ['Admin', 'Admin']];
const embeds = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('helpslash')
    .setDescription('help command')
    .addStringOption(option => 
      option
        .setName('module')
        .setDescription('Command Modules')
        .addChoices(choices)
        .setRequired(true)),
  async execute(interaction) {
    const input = interaction.options.getString('module');
    interaction.reply({ embeds: [eval('embeds.help' + input)] });
  }
}

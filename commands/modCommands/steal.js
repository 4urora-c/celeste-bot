const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('steal')
    .setDescription('Steals an emote and adds it to the server')
    .setDefaultPermission(false)
    .addStringOption(option =>
      option
        .setName('emote')
        .setDescription('The emote to steal')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('The name of the emote')
        .setRequired(true)),
  async execute (interaction) {
  await interaction.deferReply()

   const hasEmoteRegex = /<a?:.+:\d+>/gm
   const emoteNameRegex = /([a-zA-Z]+([0-9]+[a-zA-Z]+)+)/i;
   const emoteRegex = /<:.+:(\d+)>/gm
   const animatedEmoteRegex = /<a:.+:(\d+)>/gm

   const emote = interaction.options.getString('emote');
   let emotename = interaction.options.getString('name');
   try {
   if (emoji = emoteRegex.exec(emote.match(hasEmoteRegex))) {
   const url = await `https://cdn.discordapp.com/emojis/${emoji[1]}.png?v=1`
   const staticemote = await interaction.guild.emojis.create(url, emotename)
   const embed = new Discord.MessageEmbed()
   .setColor('GREEN')
   .setDescription(`Static emote **${emotename}** ${staticemote} has been added to the server!`)
   return interaction.editReply({embeds: [embed]})
   }
   else if (emoji = animatedEmoteRegex.exec(emote.match(hasEmoteRegex))) {
   const url = await `https://cdn.discordapp.com/emojis/${emoji[1]}.gif?v=1`
   const aniemote = await interaction.guild.emojis.create(url, emotename)
   const embed = new Discord.MessageEmbed()
   .setColor('GREEN')
   .setDescription(`Animated emote **${emotename}** ${aniemote} has been added to the server!`)
   return interaction.editReply({embeds: [embed]})
   }
   else {
   interaction.editReply("Couldn't find an emoji to add!")
   }
 } catch(err) {
   interaction.editReply(err.stack)
   const embed = new Discord.MessageEmbed()
   .setColor('RED')
   .setDescription('There was an error while adding the emote to the server!')
   return interaction.editReply({embeds: [embed]});
 }
  },
};

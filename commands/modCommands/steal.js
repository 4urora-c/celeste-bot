const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
      .setName('steal')
      .setDescription('Steal an emote from other servers!')
      .addStringOption(option =>
        option
          .setName('emote')
          .setDescription('The emote to add')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('name')
          .setDescription('The name of the emote'))
      .setDefaultPermission(false),
    async execute (interaction) {

   const hasEmoteRegex = /<a?:.+:\d+>/gm
   const emoteRegex = /<:.+:(\d+)>/gm
   const animatedEmoteRegex = /<a:.+:(\d+)>/gm

   const message2 = interaction.options.getString('emote').match(hasEmoteRegex);
   const emotename = interaction.options.getString('name') || interaction.options.getString('emote').match(hasEmoteRegex).toString();
   await interaction.deferReply()
   try {
   if (emoji = emoteRegex.exec(message2)) {
   const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1"
   interaction.guild?.emojis.create(url, emotename)
   const embed = new Discord.MessageEmbed()
   .setColor('GREEN')
   .setDescription(`Static emote **${emotename}** has been added to the server!`)
   return interaction.editReply({embeds: [embed]})
   }
   else if (emoji = animatedEmoteRegex.exec(message2)) {
   const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif?v=1"
   interaction.guild.emojis.create(url, emotename)
   const embed = new Discord.MessageEmbed()
   .setColor('GREEN')
   .setDescription(`Animated emote **${emotename}** has been added to the server!`)
   return interaction.editReply({embeds: [embed]})
   }
   else {
   interaction.editReply("Couldn't find an emoji to add!")
   }
 } catch(err) {
   const embed = new Discord.MessageEmbed()
   .setColor('RED')
   .setDescription('There was an error while adding the emote to the server!')
   return interaction.editReply({embeds: [embed]});
 }
  },
};

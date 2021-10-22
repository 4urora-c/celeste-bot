const Discord = require('discord.js');
const { getTracks, getPreview } = require("spotify-url-info")
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
      .setName('stonks')
      .setDescription(`Honestly, the name of this command would be 'maxbells' if it were my choice.`),
    async execute(interaction) {
    const embed = new Discord.MessageEmbed()
    .setAuthor('HOW TO')
    .setColor('#2f3136')
    .setTitle('<a:turnip:851010043486273547> Max ABD / 999,999,999 bells turnip glitch <a:turnip:851010043486273547>')
    .setDescription('Allows you to __max out__ your ABD (999,999,999 bells) in one trip.\n')
    .addField('**__Steps:__**', '\n• Type “__**1 drop 30 turnips**__” in <#808230895064449025> with the corresponding prefix to drop one stack of 30 turnips. \n• Sell the item “**30 turnips**” at the corresponding island\'s Nook\'s Cranny. \n• The Nooklings will be offering you **- 64 million bells** in return.\n• Fly back to your island and check your ABD at residential services, and it should have maxed out to **999,999,999** bells.\n')
    .addField('<a:beware:851010042919780383> __**Beware**__ <a:beware:851010042919780383>', 'Doing this glitch will **remove** your “__**Cornering the Stalk Market**__" achievement. In order to gain back the achievement, you will have to sell **65 million bells** in turnips.')
    .setThumbnail('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/36bea353-721f-48af-b08d-a55404cc58e1/dduviox-0b2b8d0c-b580-480e-986e-8216222c0fb3.png/v1/fill/w_350,h_350,strp/turnip__new_horizons__by_gohdlike_dduviox-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzUwIiwicGF0aCI6IlwvZlwvMzZiZWEzNTMtNzIxZi00OGFmLWIwOGQtYTU1NDA0Y2M1OGUxXC9kZHV2aW94LTBiMmI4ZDBjLWI1ODAtNDgwZS05ODZlLTgyMTYyMjJjMGZiMy5wbmciLCJ3aWR0aCI6Ijw9MzUwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.TPgYRVl-vsMp0zw2LW9q3a1AAxtIJiQ7WFcpo2k2Nts')
    interaction.reply({embeds: [embed]});
  },
};

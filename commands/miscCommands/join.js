/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Use this when you are ready to join the rest of the server')
    .setDefaultPermission(true),
  async execute(interaction) {
    const embed = new Discord.MessageEmbed()
    .setTitle('Joining the server')
    .setDescription('Have you read and agree to the rules?')
    const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
      .setCustomId('accept')
      .setLabel('Yes')
      .setStyle('SUCCESS'),
      new Discord.MessageButton()
      .setCustomId('reject')
      .setLabel('No')
      .setStyle('DANGER')
    );
    const collector = interaction.channel.createMessageComponentCollector({time: 15000 });
    await interaction.reply({embeds: [embed], components: [row]});
    collector.on('collect', async i => {
	     if (i.customId === 'accept') {
           const embed = new Discord.MessageEmbed()
           .setTitle('Joining the server')
           .setDescription(`Please welcome ${interaction.member} to the server!`)
           await i.update({ embeds: [embed], components: [] });
           return interaction.member.roles.add(interaction.guild.roles.cache.find((r => r.name.toLowerCase() === 'basic')))
         } else if (i.customId === 'reject') {
           const embed = new Discord.MessageEmbed()
           .setTitle('Joining the server')
           .setDescription('The user left the server')
           await i.update({embeds: [embed], components: [] });
           interaction.member.send('Sorry that our server wasn\'t right for you! Feel free to rejoin anytime you wish at ** discord.gg/polaris **!')
           if(!interaction.member.bannable) return console.log(`${interaction.member.user.username}#${interaction.member.user.discriminator} cannot be removed from the server.`);
           console.log(`Removing ${interaction.member.user.username}#${interaction.member.user.discriminator} from server for rejecting rules`)
           return interaction.member.kick()
         }
        });

  }
};

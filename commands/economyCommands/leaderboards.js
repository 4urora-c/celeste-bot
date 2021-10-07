/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const Discord = require('discord.js');
//const Canvas = require('canvas');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
data: new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Shows the currency leaderboard for the server')
  .setDefaultPermission(false),
  async execute(interaction, config) {
    const data = await interaction.client.db.userdata.find({guildID: interaction.guild.id}).toArray();
    const overall = data.sort((a, b) => b.coins - a.coins)

    //Canvas.registerFont('fonts/Nexa Bold.otf', { family: 'NexaBold', style: 'Heavy', weight: 'Normal' });
    //const canvas = Canvas.createCanvas(589, 916);
  //  const ctx = canvas.getContext('2d');
    const guilddata2 = await interaction.client.db.config.findOne({
      id: interaction.guild.id,
    });
  //  let background = await Canvas.loadImage(guilddata2.lbimage ? guilddata2.lbimage : 'img/leaderboards/leaderboardsbg1.png');
  //  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  //  background = await Canvas.loadImage('img/leaderboards/leaderboards1.png');
  //  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    let i = 0;
    let content = '';
    const guilddata = await interaction.client.db.islandinfo.findOne({
      guildid: interaction.guild.id,
    });
    if (guilddata2.economy === 'false') return interaction.reply('Economy is disabled on this guild!');
  /*  for(v<=data.length) {
      if (data[v].id === currentmember) {
        content += `Your position: **${v+1} / ${data.length}** \n\n`;
      }
      v++;
    }*/
    function fn() {
      try {
        for(v=0;v<=data.length;v++) {
          if (data[v].id === interaction.member.id) {
            return v+1;
          }
        }
    } catch(err) {
      return 'N/A'
    }
    }
    const memberRank = fn();
    for (const user of overall) {
      const currentUser = interaction.guild.members.cache.get(user.id);
      if (i < 11) {
        i++;
      } else {
        break;
      }
      let badge = '';
      if (i === 1) {
        badge += '🥇';
      } else if (i === 2) {
        badge += '🥈';
      } else if (i === 3) {
        badge += '🥉';
      } else {
        badge += '🎗️';
      }

      content += `${badge} **${i}.** ${currentUser ? `${currentUser.displayName}` : 'Member Left'} - ${`${user.coins} **${guilddata.currencyname ? guilddata.currencyname : 'Bells'}**`} `+ '\n';

    }
    const embed = new Discord.MessageEmbed()
    .setThumbnail(interaction.guild.iconURL())
    .setDescription(`Your Position: **${memberRank} / ${data.length}** \n\n**Leaderboard**\n`+ content)
    .setTimestamp()
    .setTitle(`Leaderboard - Top 10 (${guilddata.currencyname ? guilddata.currencyname : 'Bells'})`)
    interaction.reply({embeds: [embed]})
  },
};

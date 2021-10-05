/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Use this when you are ready to join the rest of the server')
    .addStringOption(option =>
      option
        .setName('target')
        .setDescription('The target user(s) to add currency to')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('amount')
        .setDescription('The amount of currency to add')
        .setRequired(true)),
  async execute(interaction) {
    const guilddata = await interaction.client.db.config.findOne({
      id: interaction.guild.id,
    });
    if (!guilddata.economy || guilddata.economy === 'true') {
    let tar = interaction.options.getString('target')
    let amount = parseInt(interaction.options.getString('amount'), 10);
    const guilddata = await interaction.client.db.islandinfo.findOne({ guildid: interaction.guild.id });
    let target = tar.mentions.members.first() || interaction.guild.members.cache.get(tar) || tar.mentions.roles.first();
    if (isNaN(amount)) {
      interaction.reply('Enter a valid amount to add');
      return;
    }
    if (tar === 'premium') {
      target = 'premium users'
      let i = 0;
      const user = await interaction.client.db.islandinfo.find().toArray()
      async function complete() {
        const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription(`✅ ${interaction.member} gave ${i} ${target} ${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}!`);
        interaction.reply({embeds: [embed]})
      }
      function addPremium(amt) {
        user.forEach(check => {
          try {
          if (check.hasPremium === 'true') {
            i ++;
            console.log(check.id)
           interaction.client.db.userdata.updateOne({id: check.id, guildID: interaction.guild.id}, {$inc: {coins: amount}}, {upsert: true})
         } } catch(err) {}
        })
      }
      addPremium(amount)
      return complete();
    }
    const embed = new Discord.MessageEmbed()
    .setColor('#5b4194')
    .setDescription(`✅ ${interaction.member} gave ${target} ${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}!`);
    const isRole = interaction.guild.roles.cache.has(target.id);
    if (!isRole) {
    await interaction.client.db.userdata.updateOne({ id: target.id, guildID: interaction.guild.id }, { $inc: { coins: amount } }, { upsert: true });
    interaction.reply({embeds: [embed]});
  } else if (isRole) {
    target.members.forEach(async updateuser => {
    await interaction.client.db.userdata.updateOne({ id: updateuser.id, guildID: interaction.guild.id }, { $inc: {coins: amount } }, { upsert : true });
    });
    interaction.reply({embeds: [embed]});
  }
  } else {
    return interaction.reply('Economy is disabled on this guild!');
  }
  },
};

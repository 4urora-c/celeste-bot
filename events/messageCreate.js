/* eslint-disable max-len */
const initializeGuild = require('../utils/initializeGuild');
const msToString = require('../utils/msToString');
const Discord = require('discord.js');
module.exports = (client, distube, message) => {
  if (!client.ready) return;
  if (message.member.bot) return;
  const msg = message.content.toLowerCase();
  const commandName = msg.split(' ')[0].substring(1);
  const date = () => {

      var date = new Date();

      var hour = date.getHours();
      hour = (hour < 10 ? "0" : "") + hour;

      var min  = date.getMinutes();
      min = (min < 10 ? "0" : "") + min;

      var sec  = date.getSeconds();
      sec = (sec < 10 ? "0" : "") + sec;

      var year = date.getFullYear();

      var month = date.getMonth() + 1;
      month = (month < 10 ? "0" : "") + month;

      var day  = date.getDate();
      day = (day < 10 ? "0" : "") + day;

      return hour + ":" + min + ":" + sec;

  }
  if (!message.member) {
    return;
  }

  const config = client.guildConfig[message.guild.id];

  if (!config) {
    initializeGuild(client, message.guild.id);
    return;
  }
  async function checkHighlights() {
    const highlights = await client.db.userdata.find({guildID: message.guild.id  }).toArray()
    highlights.forEach((user) => {
      if (user.highlightList) {
        const triggeredWord = user.highlightList.find((word) => message.content.toLowerCase().includes(word.toLowerCase()));
        if (triggeredWord) {
          let discordUser = client.users.cache.get(user.id);
          if (discordUser) {
            if (message.member.id === user.id) return;
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setTitle(triggeredWord)
            .setDescription(`**\[${date()}\] ${message.member.displayName}**: ${message.content}`)
            .addField('Source', `[Jump to](${message.url})`)
            .setTimestamp()
            discordUser.send({embeds: [embed], content: `In **${message.guild.name}** ${message.channel}, your highlight "${triggeredWord}" was mentioned.`});
      }
    }
  }
})

}
  async function checkBoostStatus() {
    try {
      if (!message.member?.roles.cache.some(role => role.name.toLowerCase() === 'booster') && message.member?.roles.cache.some(role => role.name.toLowerCase() === 'supporter')) {
      if (message.member.roles.cache.some(r => r.id === '819189757208428564')) {
        message.member.roles.remove('819189757208428564')
      }
      if (message.member.roles.cache.some(r => r.id === '819189634382692402')) {
        message.member.roles.remove('819189634382692402')
      }
      if (message.member.roles.cache.some(r => r.id === '819189688925421589')) {
        message.member.roles.remove('819189688925421589')
      }
      if (message.member.roles.cache.some(r => r.id === '819189847503142912')) {
        message.member.roles.remove('819189847503142912')
      }
      if (message.member.roles.cache.some(r => r.id === '819190376581562398')) {
        message.member.roles.remove('819190376581562398')
      }
      if (message.member.roles.cache.some(r => r.id === '819190511574450217')) {
        message.member.roles.remove('819190511574450217')
      }
      if (message.member.roles.cache.some(r => r.id === '819190743495213116')) {
        message.member.roles.remove('819190743495213116')
      }
      if (message.member.roles.cache.some(r => r.id === '819192274549997618')) {
        message.member.roles.remove('819192274549997618')
      }
    }

  } catch(err) {

  }
  }
  async function checkSupporterStatus() {
    try {
      if (!message.member.roles.cache.some(role => role.name.toLowerCase() === 'booster') && !message.member.roles.cache.some(role => role.name.toLowerCase() === 'supporter')) {
        if (message.member.roles.cache.some(role => role.name === message.member.id)) {
        await message.guild.roles.cache.find(role => role.name === message.member.id).delete();
        }
      }
    } catch(err) {console.log(err.stack)}
  }
    if (message.content.startsWith(config.prefix)) {
    const command = client.commands.get(commandName);
    if (!client.commands.has(commandName)) return;
    try {
      if (config.cooldowns) {
        if (config.cooldowns[commandName]) {
          if (!client.cooldowns[message.guild.id][commandName]) {
            client.cooldowns[message.guild.id][commandName] = {};
          }
          if (client.cooldowns[message.guild.id][commandName][message.author.id]) {
            message.channel.send(`You're on cooldown.${msToString(config.cooldowns[commandName] - (Date.now() - client.cooldowns[message.guild.id][commandName][message.author.id]))}`);
            return;
          }
          client.cooldowns[message.guild.id][commandName][message.author.id] = Date.now();
          setTimeout(() => {
            delete client.cooldowns[message.guild.id][commandName][message.author.id];
          }, config.cooldowns[commandName]);
        }
      }
      command.execute(client, message, config, distube);
      console.log(`Processing command: ${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing your command!');
    }
  } else {
    try {
    checkHighlights();
    checkBoostStatus();
    checkSupporterStatus();
  } catch(err) {
    console.log('something went wrong with boost status')
  }
  }
};

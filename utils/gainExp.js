/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { embed } = require('../utils');
const roleChange = require('./roleChange');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, message, config) => {
  if (!client.cooldowns[message.guild.id].chatExp) {
    client.cooldowns[message.guild.id].chatExp = {};
  }
  const guilddata = await client.db.config.findOne({
    id: message.guild.id,
  });
  if (!guilddata.economy || guilddata.economy === 'true') {
  const chatCooldown = client.cooldowns[message.guild.id].chatExp;
  const {
    minTime, maxTime, minExp, maxExp, minCoins, maxCoins,
  } = config.levelSettings;
  const isXpBanned = message.member.roles.cache.some((r) => r.name === 'XP Banned');
  if (!chatCooldown[message.author.id] && !isXpBanned) {
    const randomTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);
    const randomExp = Math.floor(Math.random() * (maxExp - minExp) + minExp);
    const randomCoins = Math.floor(Math.random() * (maxCoins - minCoins) + minCoins);
    await client.db.userdata.updateOne(
      { id: message.author.id, guildID: message.guild.id },
      {
        $inc: {
          exp: randomExp,
          coins: randomCoins,
        },
      },
      { upsert: true },
    );
    const userdata = await client.db.userdata.findOne({ id: message.author.id, guildID: message.guild.id });
    if (userdata) {
      const nextLevel = config.levels.findIndex((explevel) => userdata.exp + 100 < explevel);
      const userLevelRole = nextLevel;
      if (userLevelRole >= 0) {
        config.levelRoles.forEach((role, index) => {
          if (index !== userLevelRole) {
            if (message.member.roles.cache.some((r) => r.name === role)) {
              roleChange.remove(message.member, role);
            }
          } else if (!message.member.roles.cache.some((r) => r.name === role)) {
            roleChange.add(message.member, role);
            const embed = new MessageEmbed()
            .setColor('#5b4194')
            .setTitle('LEVEL UP')
            .setDescription(`Congratulations ${message.author}! You are now level ${nextLevel+1}!`);
            const levelchannel = client.channels.cache.get(client.guildConfig[message.guild.id].channels.levelchannel);
            if (levelchannel) {
              try {
              client.channels.cache.get(levelchannel.id).send({embeds: [embed]});
            } catch(err) {
              console.log(err.stack);
            }
            } else {
              message.channel.send({embeds: [embed]});
            }
          }
        });
      }
    }
    chatCooldown[message.author.id] = true;
    setTimeout(() => {
      delete chatCooldown[message.author.id];
    }, 1000 * randomTime);
  }
}
};

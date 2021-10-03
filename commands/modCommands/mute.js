/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
const stringToMs = require('../../utils/stringToMs');

module.exports = {
  name: 'mute',
  description: 'mute',
  aliases: 'm',
  execute: async (client, message, config) => {
    if (message.author.id !== '620196347890499604' && !message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.permissions.has(['ADMINISTRATOR']))) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    let reason = msgArr.slice(3).join(' ');
    if (reason === '' || !reason) {
      reason = 'Unknown';
    }

    const member = message.mentions.members.first() || message.guild.members.cache.get(msgArr[1]);
    if (!member) {
      message.channel.send('You must tag the user you want to mute! `!mute @user 30s <reason>`');
      return;
    }

    if (!msgArr[2]) {
      message.channel.send('You must provide the duration! `!mute @user 30s <reason>`');
      return;
    }

    const duration = stringToMs(msgArr[2]);
    if (duration === -1) {
      message.channel.send('Invalid duration provided! `!mute @user 30s <reason>`');
      return;
    }

    const modData = await client.db.modstats.findOne({ id: message.author.id }) || {};
    const modMutes = modData.mutes || [];
    modMutes.push({
      user: member.id,
      date: Date.now(),
      duration,
    });

    let role = message.member.guild.roles.cache.find((f) => f.name === 'Muted');
    if (!role) {
      role = await message.member.guild.roles.create({
        data: {
          name: 'Muted',
        },
        reason: 'Role for Muted',
      });
    }
    member.roles.add(role);
    message.channel.send(`${member} has been muted for ${msgArr[2]}`);
    member.send(`You have been muted for ${msgArr[2]}\nReason: ${reason}`);
    client.mutes[member.id] = setTimeout(() => {
      member.roles.remove(role);
      client.db.mute.deleteOne({ id: member.id, guildID: message.guild.id });
      member.send('Your mute has ended!');
    }, duration);

    client.db.mute.updateOne({ id: member.id, guildID: message.guild.id }, { $set: { start: Date.now(), duration, reason } }, { upsert: true });
    await client.db.modstats.updateOne({ id: message.author.id, guildID: message.guild.id }, { $set: { mutes: modMutes } }, { upsert: true });
  },
};

/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  name: 'leaderboards',
  description: 'Print leaderboards',
  aliases: 'lb',
  execute: async (client, message, config) => {
    const msgArr = message.content.split(' ');
    let page = 0;
    if (msgArr[1] !== 'points' || msgArr[1] !== 'levels') {
    if (msgArr[1]) {
      if (!isNaN(msgArr[1])) {
        page = parseInt(msgArr[1], 10) - 1;
        if (page < 0) { page = 1; }
      }
    }
  } else if (msgArr[1] === 'points' || msgArr[1] === 'levels') {
    if (msgArr[2]) {
      if (!isNaN(msgArr[2])) {
        page = parseInt(msgArr[2], 10) - 1;
        if (page < 0) { page = 1; }
      }
  }
}

  if (msgArr[1] !== 'levels') {
    if (client.leaderboards) {
      clearInterval(client.leaderboards);
    }
    const data = await client.db.userdata.find({guildID: message.guild.id}).toArray();
    const overall = data.sort((a, b) => b.coins - a.coins).slice(0 + page * 10, 10 + page * 10);

    Canvas.registerFont('fonts/Nexa Bold.otf', { family: 'NexaBold', style: 'Heavy', weight: 'Normal' });
    const canvas = Canvas.createCanvas(589, 916);
    const ctx = canvas.getContext('2d');
    const guilddata2 = await client.db.config.findOne({
      id: message.guild.id,
    });
    let background = await Canvas.loadImage(guilddata2.lbimage ? guilddata2.lbimage : 'img/leaderboards/leaderboardsbg1.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    background = await Canvas.loadImage('img/leaderboards/leaderboards1.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    let i = 0;
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    if (guilddata2.economy === 'false') return message.channel.send('Economy is disabled on this guild!');
    for (const user of overall) {
      const currentUser = message.guild.members.cache.get(user.id);
      // Print Name
      ctx.font = '32px NexaBold';
      ctx.fillStyle = 'rgb(236, 229, 216)';
      ctx.fillText(currentUser ? currentUser.displayName : 'Member Left', 147, 154 + i * 78.2);

      // Print Exp
      ctx.font = '20px NexaBold';
      ctx.fillStyle = 'rgb(236, 229, 216)';
      ctx.fillText(`${user.coins} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`, 147, 184 + i * 78.2);

      // Print Rank
      ctx.font = '34px NexaBold';
      ctx.fillStyle = 'rgb(39, 39, 39)';
      ctx.fillText(`#${i + 1 + page * 10}`, 30, 170 + i * 78.2);

      i += 1;
    }
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'leaderboard.png');
    message.channel.send({files: [
      { file: attachment }
  ]});
  } else if (msgArr[1] === 'levels') {
    if (client.leaderboards) {
      clearInterval(client.leaderboards);
    }
    const data = await client.db.userdata.find({guildID: message.guild.id}).toArray();
    const overall = data.sort((a, b) => b.exp - a.exp).slice(0 + page * 10, 10 + page * 10);
    const guilddata2 = await client.db.config.findOne({
      id: message.guild.id,
    });
    Canvas.registerFont('fonts/Nexa Bold.otf', { family: 'NexaBold', style: 'Heavy', weight: 'Normal' });
    const canvas = Canvas.createCanvas(589, 916);
    const ctx = canvas.getContext('2d');

    let background = await Canvas.loadImage(guilddata2.lbimage ? guilddata2.lbimage : 'img/leaderboards/leaderboardsbg1.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    background = await Canvas.loadImage('img/leaderboards/leaderboards1.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    let i = 0;
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    if (guilddata2.economy === 'false') return message.channel.send('Economy is disabled on this guild!');
    for (const user of overall) {
      const currentUser = message.guild.members.cache.get(user.id);
      // Print Name
      ctx.font = '32px NexaBold';
      ctx.fillStyle = 'rgb(236, 229, 216)';
      ctx.fillText(currentUser ? currentUser.displayName : 'Member Left', 147, 154 + i * 78.2);

      // Print Exp
      ctx.font = '20px NexaBold';
      ctx.fillStyle = 'rgb(236, 229, 216)';
      ctx.fillText(`${user.exp} EXP`, 147, 184 + i * 78.2);

      // Print Rank
      ctx.font = '34px NexaBold';
      ctx.fillStyle = 'rgb(39, 39, 39)';
      ctx.fillText(`#${i + 1 + page * 10}`, 30, 170 + i * 78.2);

      i += 1;
    }
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'leaderboard.png');
    message.channel.send({files: [
      { file: attachment }
  ]});
  }

  },
};

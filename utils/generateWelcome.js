/* eslint-disable max-len */
const Canvas = require('canvas');
const Discord = require('discord.js');
const client = require('../index')
//module.exports = async (client, member) => {
const generateWelcome = async (user, guildname) => {
  Canvas.registerFont('fonts/Brandon_bld.otf', { family: 'NexaBold', style: 'Heavy', weight: 'Normal' });
  const canvas = Canvas.createCanvas(1024, 500);
  const ctx = canvas.getContext('2d');
 const guilddata = await client.db.config.findOne({
  id: guildname.id,
  });
  const img = new Canvas.Image();
  img.src = guilddata.welcomeimage;
  const background = await Canvas.loadImage(guilddata.welcomeimage ? 'https://cdn.discordapp.com/attachments/766679330524233779/823161183753863188/image0.png' : 'img/welcome.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Print name
  ctx.font = '80px Brandon Grotesque Bold';
  ctx.fillStyle = '#ffffff';
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 5;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.textAlign = 'center';
  ctx.fillText('WELCOME', 512, 380);
  ctx.font = '42px Brandon Grotesque Bold';
  ctx.fillText(`${user.username}#${user.discriminator}`, 512, 430);
  ctx.font = '28px Brandon Grotesque Bold';
  ctx.fillText(`To ${guildname.name}`, 512, 474);

  const profileX = 387;
  const profileY = 50;
  const profileHeight = 250;
  const profileWidth = 250;

  ctx.beginPath();
  ctx.arc(profileX + profileWidth / 2, profileY + profileHeight / 2, profileWidth / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
  ctx.drawImage(avatar, profileX, profileY, profileWidth, profileHeight);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
  return attachment;
};
//}
module.exports = generateWelcome;

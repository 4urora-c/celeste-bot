function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const Discord = require("discord.js");
module.exports = {
  name: 'help',
  description: 'help command ',
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    if (!msgArr[1]) {
    const embedA = new Discord.MessageEmbed()
	.setColor('#5b4194')
	.setDescription('Command Modules: help <module>')
  .addField('Basic', 'Lookup')
  .addField('Misc', 'Giveaway')
  .addField('Economy', 'Gambling')
  .addField('Music', 'Moderation')
  .addField('Econfig', 'Admin')
	.setFooter('Celeste by Aurora.#0001', 'https://cdn.discordapp.com/avatars/620196347890499604/a_5391c66d7eb10c5357348b13be82045a.gif?size=256&f=.gif');
//  message.channel.send('Help has arrived!');
	message.channel.send('Help has arrived!', { embed: embedA });
} else if (msgArr[1].toLowerCase() === 'basic') {
  const embed = new Discord.MessageEmbed()
  .setColor('#5b4194')
  .setDescription('These are the commands you can use:')
  .addField('Basic', 'name \nset \nfriendcode \nisland \nwish');
  message.channel.send('Help has arrived!', { embed: embed });
} else if (msgArr[1].toLowerCase() === 'lookup') {
  const embed = new Discord.MessageEmbed()
  .setColor('#5b4194')
  .setDescription('These are the commands you can use:')
  .addField('Lookup', 'villager \nrecipe \nartwork');
  message.channel.send('Help has arrived!', { embed: embed });
} else if (msgArr[1].toLowerCase() === 'misc') {
  const embed = new Discord.MessageEmbed()
  .setColor('#5b4194')
  .setDescription('These are the commands you can use:')
  .addField('Misc', 'ping \nhelp \nroll \ndog \ncat \nbirb \ngif');
  message.channel.send('Help has arrived!', { embed: embed });
} else if (msgArr[1].toLowerCase() === 'giveaway') {
  const embed = new Discord.MessageEmbed()
  .setColor('#5b4194')
  .setDescription('These are the commands you can use:')
  .addField('Giveaway', 'giveaway \nreroll');
  message.channel.send('Help has arrived!', { embed: embed });
} else if (msgArr[1].toLowerCase() === 'moderation') {
  const embed = new Discord.MessageEmbed()
  .setColor('#5b4194')
  .setDescription('These are the commands you can use:')
  .addField('Moderation', 'clean \nadd \nremove \nlookup \nroles \nusers \nkick \nban \nmute \nunmute \nwarn \nwarns');
  message.channel.send('Help has arrived!', { embed: embed });
} else if (msgArr[1].toLowerCase() === 'admin') {
  const embed = new Discord.MessageEmbed()
  .setColor('#5b4194')
  .setDescription('These are the commands you can use:')
  .addField('Admin', 'setrole \nsetwish \ntogglefriendcode \nwelcomechannel \npermissions \npermission \nsetprefix \nreactionrole \naddreactionrole \nlevelupchannel \nwelcomeimage \nsetcooldown');
  message.channel.send('Help has arrived!', { embed: embed });
}  else if (msgArr[1].toLowerCase() === 'economy') {
  const embed = new Discord.MessageEmbed()
  .setColor('#5b4194')
  .setDescription('These are the commands you can use:')
  .addField('Economy', 'profile \n balance \nsend \nleaderboards \nfish \nexplore \nhunt \ncrime \nwork \nservershop \nservershopbuy \nsetprofileimage');
  message.channel.send('Help has arrived!', { embed: embed });
}  else if (msgArr[1].toLowerCase() === 'gambling') {
  const embed = new Discord.MessageEmbed()
  .setColor('#5b4194')
  .setDescription('These are the commands you can use:')
  .addField('Gambling', 'blackjack \nflip \nroulette \nslots');
  message.channel.send('Help has arrived!', { embed: embed });
} else if (msgArr[1].toLowerCase() === 'econfig') {
  const embed = new Discord.MessageEmbed()
  .setColor('#5b4194')
  .setDescription('These are the commands you can use:')
  .addField('Economy Config', 'add \nremove \naddshop \nremoveshop \nsetexplore \nsetfish \nsetwork \nsetcrime \nsethunt \ntogglelevelrole \nseteconomy');
  message.channel.send('Help has arrived!', { embed: embed });
} else if (msgArr[1].toLowerCase() === 'music') {
  const embed = new Discord.MessageEmbed()
  .setColor('#5b4194')
  .setDescription('These are the commands you can use:')
  .addField('Music', 'play \nfilters \nqueue \nskip \nstop');
  message.channel.send('Help has arrived!', { embed: embed });
} else {
  message.channel.send('That is an invalid command module!');
}
},
}

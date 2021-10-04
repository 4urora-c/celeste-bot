const { MessageEmbed } = require('discord.js');

const helpBasic = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Basic', 'name \nset \nfriendcode \nisland \nwish');
const helpLookup = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Lookup', 'villager \nrecipe \nartwork');
const helpMisc = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Misc', 'ping \nhelp \nroll \ndog \ncat \nbirb \ngif');
const helpGiveaway = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Giveaway', 'giveaway \nreroll');
const helpModeration = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Moderation', 'clean \nadd \nremove \nlookup \nroles \nusers \nkick \nban \nmute \nunmute \nwarn \nwarns');
const helpAdmin = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Admin', 'setrole \nsetwish \ntogglefriendcode \nwelcomechannel \npermissions \npermission \nsetprefix \nreactionrole \naddreactionrole \nlevelupchannel \nwelcomeimage \nsetcooldown');
const helpEconomy = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Economy', 'profile \n balance \nsend \nleaderboards \nfish \nexplore \nhunt \ncrime \nwork \nservershop \nservershopbuy \nsetprofileimage');
const helpGambling = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Gambling', 'blackjack \nflip \nroulette \nslots');
const helpEconfig = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Economy Config', 'add \nremove \naddshop \nremoveshop \nsetexplore \nsetfish \nsetwork \nsetcrime \nsethunt \ntogglelevelrole \nseteconomy \nsetlbimage');
const helpMusic = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Music', 'play \nfilters \nqueue \nskip \nstop');
const helpMemes = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Memes', 'joke \nmeme \nanimeme \nshowerthoughts \ntil');
const helpRoleplay = new MessageEmbed()
    .setColor('#5b4194')
    .setDescription('These are the commands you can use:')
    .addField('Roleplay', 'blush \ncry \ncuddle \ndab \ndance \nfacepalm \nhighfive \nholdhands \nhug \nkill \nkiss \nlove \nno \npat \npoke \npout \nslap \nstare \nthumbsup \nwave \nwink \nyes');

module.exports = { helpBasic, helpLookup, helpMisc, helpGiveaway, helpModeration, helpAdmin, helpEconomy, helpGambling, helpEconfig, helpMusic, helpMemes, helpRoleplay };
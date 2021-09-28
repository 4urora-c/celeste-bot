// This is the starting point of the bot
require('dotenv-flow').config();
const Discord = require('discord.js');
const fs = require('fs');
const DisTube = require('distube');

const token = process.env.BOT_TOKEN;
const distubeListeners = require('./utils/music/distubeListeners');

const client = new Discord.Client({
  intents: ["DIRECT_MESSAGES",
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_PRESENCES",
    "GUILD_BANS",
    "GUILD_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_REACTIONS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_MESSAGE_TYPING",
    "GUILD_WEBHOOKS",
    "GUILD_INTEGRATIONS",
    "GUILD_PRESENCES",
    "GUILD_INVITES"
  ]
});
client.commands = new Discord.Collection();

const distube = new DisTube(client, {
  searchSongs: true,
  emitNewSongOnly: true
});
const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || 'Off'}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? 'All Queue' : 'This Song' : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;
distubeListeners(distube, status);

client.on('ready', () => {
  client.guilds.cache.forEach((server) => {
    console.log(`${server.name} (id: ${server.id})`);
  });
  client.user.setStatus('online');
  client.user.setActivity(`${client.users.cache.size} users | ;help`, {
    type: 'LISTENING'
  });
});
client.on('guildMemberAdd', newMember => { //when someone new joins a guild
  client.user.setActivity(`${client.users.cache.size} users | ;help`, {
    type: 'LISTENING'
  }); //Update the activity every time someone joins a guild
  try {
    if ((Date.now() - newMember.user.createdAt < 1000 * 60 * 60 * 24 * 30) && newMember.user.displayAvatarURL() === 'https://cdn.discordapp.com/embed/avatars/0.png') {
      const newMemberBan = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription('Your account has been kicked from Polaris as it is too new. Please come back when your account is more than 7 days old or you have changed your profile picture.')
        .setTimestamp();
      newMember.send({
        embed: newMemberBan
      });
      newMember.kick();
    }
  } catch (err) {
    console.log(err.stack)
  }
});
client.on('messageDelete', messageDelete => {
  let mlog = client.db.islandinfo.findOne({
    guildid: messageDelete.guild.id
  });
  try {
    if (messageDelete.guild.id = '713843260744925234') return;
    if (messageDelete.member.user.bot || messageDelete.member.hasPermission('MANAGE_MESSAGES') || mlog.messagelog === 'false') {
      return;
    }
  } catch (err) {
    console.log(err.stack)
  }
  try {
    const embed = new Discord.MessageEmbed()
      .setColor('#2f3136')
      .setAuthor(messageDelete.member.user.tag, messageDelete.member.user.avatarURL())
      .setTitle('Message Deleted!')
      .setDescription(`${messageDelete.content}`)
    messageDelete.channel.send({
      embed: embed
    })
  } catch (err) {
    console.log(err.stack)
  }
});



const importAllFiles = (dir) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    files.forEach((file) => {
      if (file.endsWith('.js')) {
        const props = require(`${dir}${file}`);
        console.log(`Successfully loaded ${props.name}`);
        client.commands.set(props.name, props);
        client.commands.set(props.aliases, props);
      } else if (fs.lstatSync(`${dir}${file}/`).isDirectory()) {
        importAllFiles(`${dir}${file}/`);
      }
    });
  });
};

importAllFiles('./commands/');

fs.readdir('./events/', (err, files) => {
  if (err) {
    console.error();
    return;
  }
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    const evt = require(`./events/${file}`);
    const evtName = file.split('.')[0];
    console.log(`Event: ${evtName} loaded!`);
    client.on(evtName, (...args) => evt(client, distube, ...args));
  });
});

client.login(token);

module.exports = client;
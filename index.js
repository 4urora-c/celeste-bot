// This is the starting point of the bot
const Discord = require('discord.js');
const fs = require('fs');
const DisTube = require('distube');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.js');

const token = config.token;
const distubeListeners = require('./utils/music/distubeListeners');
const permissions = require('./utils/permissions');
const client = new Discord.Client({
  partials: ["USER", "CHANNEL", "MESSAGE", "REACTION"],
  intents: ["DIRECT_MESSAGES",
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_INVITES
  ]
});
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.buttons = new Discord.Collection();
const commands = [];
const rest = new REST({ version: '9' }).setToken(token);

const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
  const button = require(`./buttons/${file}`);
  client.buttons.set(button.data.name, button);
}

const distube = new DisTube(client, {
  searchSongs: 10,
  emitNewSongOnly: true
});
const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || 'Off'}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? 'All Queue' : 'This Song' : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;
distubeListeners(distube, status);

client.on('ready', () => {
  //permissions.refreshCommandPermissionsGlobal(client);  //for global permissions, means private dms, all servers etc.

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
      newMember.kick();
}
} catch (e) {
  newMember.kick()
}
})

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      if (error) console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

fs.readdir('./events/', async (err, files) => {
  if (err) {
    console.error();
    return;
  }
  const importAllFiles = async (dir) => {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, async (err, files) => {
        if (err) {
          console.log(err);
          resolve(files);
        }
        for (const file of files) {
          if (file.endsWith('.js')) {
            const props = require(`${dir}${file}`);
            console.log(`Successfully loaded ${props.name ? props.name : props.data.name}`);
            if (props.data) {
              client.slashCommands.set(props.data.name, props);
              try {
                commands.push(props.data.toJSON());
              } catch {
                commands.push(props.data);
              }
            }
            client.commands.set(props.name, props);
            client.commands.set(props.aliases, props);
          } else if (fs.lstatSync(`${dir}${file}/`).isDirectory()) {
            await importAllFiles(`${dir}${file}/`);
          }
        }
        resolve(files);
      });
    });
  };
  await importAllFiles('./commands/');
  client.on("ready", async () => {
      if (!client.ready) await client.utils.delay(5000);
      client.guilds.cache.forEach(async(server) => {
          try {
              await rest.put(
                  Routes.applicationGuildCommands(client.user.id, server.id),
                  { body: commands },
              );
              console.log(`A total of ${commands.length} (/) commands were loaded.`);
          } catch (error) {
              console.error(error);
          }
      })
      await client.utils.delay(5000);
  })
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    const evt = require(`./events/${file}`);
    const evtName = file.split('.')[0];
    console.log(`Event: ${evtName} loaded!`);
    client.on(evtName, (...args) => evt(client, distube, ...args));
  });
});
const clientId = '821212153075073054';
const guildId = '821217299058524170';
const testServer = client.guilds.cache.get(guildId)
client.login(token);
client.utils = require("utils-discord");
module.exports = client, distube;

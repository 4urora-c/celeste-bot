/* eslint-disable no-param-reassign */
/* eslint-disable import/order */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
const mongoUtil = require('../mongoUtil.js');
const config = require('../config.js');
const ready = async (client) => {
  const db = await mongoUtil.connectDB();
  client.db = {};
  client.db.userdata = await db.db().collection(config.collection.userdata);
  client.db.warn = await db.db().collection(config.collection.warn);
  client.db.ban = await db.db().collection(config.collection.ban);
  client.db.mute = await db.db().collection(config.collection.mute);
  client.db.islandinfo = await db.db().collection(config.collection.islandinfo);
  client.db.modstats = await db.db().collection(config.collection.modstats);
  client.db.config = await db.db().collection(config.collection.config);
  client.db.reactrole = await db.db().collection(config.collection.reactrole);
  client.reactrolelocal = await client.db.reactrole.find().toArray();
  client.guildConfig = {};
  client.mutes = {};
  client.giveaways = {};
  client.cooldowns = {};
  const dbConfig = await client.db.config.find().toArray();
  dbConfig.forEach((c) => {
    const currentGuild = client.guilds.cache.get(c.id);
    if (currentGuild) {
      client.guildConfig[c.id] = c;
      client.cooldowns[c.id] = {};
    } else {
      client.db.config.deleteOne({ id: c.id });
    }
  });

  const currentDate = Date.now();
  const pastMute = await client.db.mute.find().toArray();
  pastMute.forEach((mute) => {
    const remainingDuration = mute.duration - (currentDate - mute.start);
    const guild = client.guilds.cache.get(mute.guildID);
    const muteRole = guild.roles.cache.get((r) => r.name.toLowerCase() === 'muted');
    const member = guild.members.cache.get(mute.id);
    if (member) {
      if (remainingDuration < 0) {
        member.roles.remove(muteRole);
        client.db.mute.deleteOne({ id: mute.id });
      } else {
        client.mutes[mute.id] = setTimeout(() => {
          member.roles.remove(muteRole);
          client.db.mute.deleteOne({ id: mute.id });
        }, remainingDuration);
      }
    }
  });
  client.ready = true;
  console.log('Bot is Ready');
};
module.exports = ready;

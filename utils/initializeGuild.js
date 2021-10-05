/* eslint-disable no-param-reassign */
module.exports = (client, guildID) => {
  client.guildConfig[guildID] = {
    channels: {
      welcomeChannel: null,
    },
    warnexpiration: 2629800000,
    permissions: {
      moderation: [],
      giveaways: [],
      joinrole: []
    },
    prefix: ';',
    levels: [
      500,
      1375,
      2875,
      41500,
      82225,
      16075,
      32025,
      64100,
      128275,
      256575,
    ],
    levelRoles: [
      'Level 1',
      'Level 2',
      'Level 3',
      'Level 4',
      'Level 5',
      'Level 6',
      'Level 7',
      'Level 8',
      'Level 9',
      'Level 10',
    ],
    levelSettings: {
      minTime: 100,
      maxTime: 200,
      minExp: 150,
      maxExp: 250,
      minCoins: 30,
      maxCoins: 70,
    },
  };

  client.db.config.updateOne({ id: guildID }, {
    $set: client.guildConfig[guildID]
  },
  { upsert: true });
  client.db.islandinfo.updateOne({ guildid: guildID }, {
    $set: {
      initialised: 'true'
    }
  }
  ,{ upsert: true });
  client.cooldowns[guildID] = {};
};

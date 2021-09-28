module.exports = {
  name: 'economyconfig',
  description: 'modify level settings',
  aliases: [],
  usage: 'economyconfig',
  execute: async (client, message, config) => {
    if (!message.author.id !== '620196347890499604' && !message.member.permissions.has('ADMINISTRATOR')) { message.reply('You\'re not allowed to use this command!'); return; }
    const msgArr = message.content.split(' ');
    if (msgArr.length === 1) {
      message.channel.send(Object.keys(config.levelSettings).map((settingName) => `> ${settingName} - ${config.levelSettings[settingName]}`).join('\n'));
      return;
    }
    if (msgArr.length === 7) {
      const newLevelSettings = {
        minTime: parseInt(msgArr[1], 10),
        maxTime: parseInt(msgArr[2], 10),
        minExp: parseInt(msgArr[3], 10),
        maxExp: parseInt(msgArr[4], 10),
        minCoins: parseInt(msgArr[5], 10),
        maxCoins: parseInt(msgArr[6], 10),
      };
      let invalid = false;
      Object.keys(newLevelSettings).forEach((settingName) => {
        if (isNaN(newLevelSettings[settingName])) {
          invalid = true;
        }
      });
      if (invalid) {
        message.channel.send('Make sure to enter in the following format: `economyconfig <minTime> <maxTime> <minExp> <maxExp> <minCoins> <maxCoins>`');
        return;
      }
      config.levelSettings = newLevelSettings;
      client.db.config.updateOne({ id: message.guild.id }, {
        $set: {
          levelSettings: config.levelSettings,
        },
      });
      message.channel.send('Successfully modified settings!');
    } else {
      message.channel.send('Make sure to enter in the following format: `economyconfig <minTime> <maxTime> <minExp> <maxExp> <minCoins> <maxCoins>`');
    }
  },
};

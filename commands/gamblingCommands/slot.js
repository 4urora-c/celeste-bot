/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { embed } = require('../../utils');
const slotMachine = require('../../utils/slotmachine');
const config = require('../../config');

module.exports = {
  name: 'slot',
  aliases: 'slots',
  description: 'Gamble in Slotmachine',
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    const userdata = await client.db.userdata.findOne({ id: message.author.id, guildID: message.guild.id });
    const guilddata = await client.db.islandinfo.findOne({
      guildid: message.guild.id,
    });
    const guilddata2 = await client.db.config.findOne({
      id: message.guild.id,
    });
    if (!guilddata2.economy || guilddata2.economy === 'true') {
    let amount = parseInt(msgArr[1], 10);``
    if (isNaN(amount)) {
      message.channel.send('Enter a valid amount');
      return;
    }
    if (userdata) {
      if (userdata.coins >= amount) {
        const slotMachineResult = slotMachine();
        message.channel.send(message, 'SLOT MACHINE', `${slotMachineResult[0]}\n\nYou spent ${amount} ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'} to play\n__**You got ${Math.floor((slotMachineResult[1] * amount).toFixed(2))} ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'}!**__\n`);
        client.db.userdata.updateOne(
          { id: message.author.id },
          {
            $set: {
              coins: userdata.coins + Math.floor((slotMachineResult[1] * amount)) - amount,
            },
          },
          { upsert: true },
        );
        return;
      }
      message.channel.send(message, 'SLOT MACHINE', `You don\'t have enough ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'} to play!`);
      return;
    }
    message.channel.send(message, 'SLOT MACHINE', `You don\'t have enough ${guilddata.currencyname ?  guilddata.currencyname : 'Bells'} to play!`);
  } else {
    return message.channel.send('Economy is disabled on this guild!');
  }
  },
};

const Discord = require("discord.js");
module.exports = {
  name: 'convert',
  description: 'lookup',
  aliases: 'hex',
  execute: async (client, message) => {
    console.log(message)
    const msgArr = message.content.split(' ');
    if (!msgArr[1]) return;
    if (msgArr[1].length > 5) {
      return message.channel.send('Item decimal IDs can only be 5 digits in length!')
    }
    function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-4).toUpperCase()
    }
    message.channel.send(toHex(msgArr[1]));

  },
};

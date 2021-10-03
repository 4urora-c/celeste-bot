const Discord = require('discord.js');
module.exports = {
  name: 'steal',
  description: 'Play music',
  aliases: 'emote',
  usage: 'play <music name>',
  admin: false,
  execute: async (client, message, config, distube) => {
    const msgArr = message.content.split(' ').slice(1);

    if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('You don\'t have permission to run that command!')
    
   const hasEmoteRegex = /<a?:.+:\d+>/gm
   const emoteRegex = /<:.+:(\d+)>/gm
   const animatedEmoteRegex = /<a:.+:(\d+)>/gm

   const messages = await message.channel.messages.fetch()
   const message2 = messages.find(m => m.content.match(hasEmoteRegex))

   try {
   if (emoji = emoteRegex.exec(message2)) {
   const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1"
   message.guild.emojis.create(url, msgArr[1])
   const embed = new Discord.MessageEmbed()
   .setColor('GREEN')
   .setDescription(`Static emote **${msgArr[1]}** has been added to the server!`)
   return message.channel.send({embeds: [embed]})
   }
   else if (emoji = animatedEmoteRegex.exec(message2)) {
   const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif?v=1"
   message.guild.emojis.create(url, msgArr[1])
   const embed = new Discord.MessageEmbed()
   .setColor('GREEN')
   .setDescription(`Animated emote **${msgArr[1]}** has been added to the server!`)
   return message.channel.send({embeds: [embed]})
   }
   else {
   message.channel.send("Couldn't find an emoji to add!")
   }
 } catch(err) {
   message.channel.send(err.stack)
   const embed = new Discord.MessageEmbed()
   .setColor('RED')
   .setDescription('There was an error while adding the emote to the server!')
   return message.channel.send({embeds: [embed]});
 }
  },
};

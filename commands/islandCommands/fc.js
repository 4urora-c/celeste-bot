/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
const Discord = require("discord.js");

function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
module.exports = {
  name: 'fc',
  aliases: 'friendcode',
  description: 'set',
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    let description = msgArr.slice(2).join(' ');
    if (msgArr[1] === 'set') {

      let name = 'Friend Code';

      if (name === 'Friend Code') {
        const isNum = /^\d+$/.test(msgArr[2]);
        if (!isNum || msgArr[2].length !== 12) {
          message.channel.send('Friend code must be 12 digits!');
          return;
        }
        description = `SW-${msgArr[2].slice(0, 4)}-${msgArr[2].slice(4, 8)}-${msgArr[2].slice(8, 12)}`;
      } else {
        name = "Friend Code";
      }

      const user = await client.db.islandinfo.findOne({
        id: message.member.id
      });
      let item;
      if (user) {
        if (user.moreinfo) {
          item = user.moreinfo.find((entry) => entry.name === name);
        }
      }
      if (item) {
        item.description = description;
        const embedA = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription(`**SW-${msgArr[2].slice(0, 4)}-${msgArr[2].slice(4, 8)}-${msgArr[2].slice(8, 12)}** has been set as your friend code!`);
        message.channel.send({
          embeds: [embedA]
        });
        client.db.islandinfo.updateOne({
          id: message.member.id
        }, {
          $set: {
            moreinfo: user.moreinfo,
          },
        }, {
          upsert: true
        }, );
      } else {
        client.db.islandinfo.updateOne({
          id: message.member.id
        }, {
          $push: {
            moreinfo: {
              name,
              description,
            },
          },
        }, {
          upsert: true
        }, );
        const embedA = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription(`**SW-${msgArr[2].slice(0, 4)}-${msgArr[2].slice(4, 8)}-${msgArr[2].slice(8, 12)}** has been set as your friend code!`);
        message.channel.send({
          embeds: [embedA]
        });
      }
      try {
        const guilddata = await client.db.islandinfo.findOne({
          guildid: message.guild.id
        });
        if (guilddata.friendcoderequirement === 'true') {
          const exists = await client.db.islandinfo.findOne({
            guildid: message.guild.id.guildid
          });
          if (exists) {
            if (guilddata.moreinfo[0].name === 'roleinfo') {
              message.member.roles.add(`${guilddata.moreinfo[0].description}`);
            } else if (guilddata.moreinfo[1].name === 'roleinfo') {
              message.member.roles.add(`${guilddata.moreinfo[1].description}`);
            }
          }
        }
      } catch (err) {
        //console.log(`No role or friend code setting found for server ${message.guild}`)
        console.log(err.stack)
        return;
      }
    } else if (message.mentions.users.first() || client.users.cache.get(msgArr[1]) || message.member) {
      const user2 = message.mentions.users.first() || client.users.cache.get(msgArr[1]) || message.member;
      const userdata = await client.db.islandinfo.findOne({
        id: user2.id
      });
      if (userdata) {
        const embed = new Discord.MessageEmbed()
          .setThumbnail(user2.avatarURL());
        try {
          if (userdata.moreinfo[1].name === 'Friend Code') {
            embed.addField('Friend Code:', userdata.moreinfo[1].description);
            message.channel.send({embeds : [embed]});
          } else if (userdata.moreinfo[0].name === 'Friend Code') {
            embed.addField('Friend Code:', userdata.moreinfo[0].description);
            message.channel.send({embeds : [embed]});
          } else if (userdata.moreinfo[2].name === 'Friend Code') {
            embed.addField('Friend Code:', userdata.moreinfo[2].description);
            message.channel.send({embeds : [embed]});
          } else {
            message.channel.send('Please set the friend code first!')
          }
        } catch (err) {
          message.channel.send('Please set the friend code and island name first!');
        }

      }
    }
  },
};

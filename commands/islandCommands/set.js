/* eslint-disable no-console */
const Discord = require('discord.js');

module.exports = {
  name: 'set',
  description: 'set',
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    let description = msgArr.slice(2).join(' ');
    if (!msgArr[1]) {
      message.channel.send('Usage of this command: `;set <island | da>`')
    }
    else if (msgArr[1] === 'island') {
      const name = 'Island';
      if (msgArr[2]) {
        const user = await client.db.islandinfo.findOne({
          id: message.author.id,
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
            .setDescription(`**${description}** has been set as your island name!`);
          message.channel.send({
            embeds: [embedA],
          });
          client.db.islandinfo.updateOne({
            id: message.author.id,
          }, {
            $set: {
              moreinfo: user.moreinfo,
            },
          }, {
            upsert: true,
          });
          const guilddata = await client.db.islandinfo.findOne({
            guildid: message.guild.id,
          });
          try {
            if (guilddata.friendcoderequirement === 'false' && user.name) {
              if (guilddata.moreinfo[0].name === 'roleinfo') {
                message.member.roles.add(guilddata.moreinfo[0].description);
              } else if (guilddata.moreinfo[1].name === 'roleinfo') {
                message.member.roles.add(guilddata.moreinfo[1].description);
              }
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          client.db.islandinfo.updateOne({
            id: message.author.id,
          }, {
            $push: {
              moreinfo: {
                name,
                description,
              },
            },
          }, {
            upsert: true,
          });
          const guilddata = await client.db.islandinfo.findOne({
            guildid: message.guild.id,
          });
          try {
            if (guilddata.friendcoderequirement === 'false' && user.name) {
              if (guilddata.moreinfo[0].name === 'roleinfo') {
                message.member.roles.add(guilddata.moreinfo[0].description);
              } else if (guilddata.moreinfo[1].name === 'roleinfo') {
                message.member.roles.add(guilddata.moreinfo[1].description);
              }
            }
          } catch (err) {
            console.log(err);
          }
          const embedA = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`**${description}** has been set as your island name!`);
          message.channel.send({
            embeds: [embedA],
          });
        }
      } else {
        message.channel.send('You must provide a name!');
      }
    } else if (msgArr[1] === 'da') {
      let name = 'DA';

      if (name.toLowerCase() === 'da') {
        const isNum = /^\d+$/.test(msgArr[2]);
        if (!isNum || msgArr[2].length !== 12) {
          message.channel.send('Dream address must be 12 digits!');
          return;
        }
        description = `DA-${msgArr[2].slice(0, 4)}-${msgArr[2].slice(4, 8)}-${msgArr[2].slice(8, 12)}`;
      } else {
        name = 'DA';
      }

      const user = await client.db.islandinfo.findOne({
        id: message.author.id,
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
          .setDescription(`**DA-${msgArr[2].slice(0, 4)}-${msgArr[2].slice(4, 8)}-${msgArr[2].slice(8, 12)}** has been set as your dream address!`);
        message.channel.send({
          embeds: [embedA],
        });
        client.db.islandinfo.updateOne({
          id: message.author.id,
        }, {
          $set: {
            moreinfo: user.moreinfo,
          },
        }, {
          upsert: true,
        });
      } else {
        client.db.islandinfo.updateOne({
          id: message.author.id,
        }, {
          $push: {
            moreinfo: {
              name,
              description,
            },
          },
        }, {
          upsert: true,
        });
        const embedA = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription(`**DA-${msgArr[2].slice(0, 4)}-${msgArr[2].slice(4, 8)}-${msgArr[2].slice(8, 12)}** has been set as your dream address!`);
        message.channel.send({
          embeds: [embedA],
        });
      }
    } else if (msgArr[1] === 'name') {
      const guilddata2 = await client.db.islandinfo.findOne({
        guildid: message.guild.id,
      });
      const userdata2 = await client.db.islandinfo.findOne({ id: message.member.id });
      if (msgArr[2]) {
        if (msgArr.slice(2).join(' ').length > 10) {
          return message.channel.send('This name is too long!')
        }
        client.db.islandinfo.updateOne(
          { id: message.author.id },
          {
            $set: {
              name: msgArr.slice(2).join(' '),
            },
          },
          { upsert: true },
        );
        try {
          if (userdata2.moreinfo[0].name === 'Island' && guilddata2.friendcoderequirement === 'false') {
            message.member.roles.add(guilddata2.moreinfo[0].description);
          } else if (userdata2.moreinfo[1].name === 'Island' && guilddata2.friendcoderequirement === 'false') {
            message.member.roles.add(guilddata2.moreinfo[1].description);
          }
        } catch (err) {
          console.log(`Missing island info for ${message.author.tag} or server does not have role set.`);
        }
        const embedA = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription(`Your name has been set to **${msgArr.slice(2).join(' ')}**!`);
        message.channel.send({ embeds: [embedA] });
      } else {
        message.channel.send('You must provide a name!');
      }
    } else {
      message.channel.send(`'**${msgArr[1]}**' is not a valid entry!`);
    }
  },
};

/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const Discord = require('discord.js');

module.exports = {
  name: 'config',
  description: 'name',
  execute: async (client, message, config) => {
    const msgArr = message.content.split(' ');
    if (msgArr[1]) {

      if (msgArr[1].toLowerCase() === 'economy') {

      if (message.author.id !== '620196347890499604' && !message.member.permissions.has(['ADMINISTRATOR'])) { return message.reply('You\'re not allowed to use this command!'); }
      if (msgArr.length >= 1) {
        const guilddata = await client.db.config.findOne({
          id: message.guild.id,
        });
        if (!msgArr[2]) {
          return message.channel.send(`Economy is set to **${guilddata.economy}**!`);
        } else {
          if (msgArr[2].toLowerCase() === 'true' || msgArr[2].toLowerCase() === 'false') {
            config.economy = msgArr[2];
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                economy: msgArr[2],
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set economy to ${msgArr[2]}!`);
            message.channel.send({embeds: [embed]});
          } else if (!guilddata) {
            return message.channel.send('Economy is set to **true**!');
          } else {
            message.channel.send('You can only specify true or false!');
          }
        }
      }
        // end economy
      } else if (msgArr[1].toLowerCase() === 'djperms') {
        // start dj perms
        if (message.author.id !== '620196347890499604' && !message.member.hasPermission(['ADMINISTRATOR'])) { return message.reply('You\'re not allowed to use this command!'); }

        const target = message.mentions.roles.first() || message.guild.roles.cache.get(msgArr[2]) || message.mentions.members.first() || message.guild.members.cache.get(msgArr[2]);
        // return console.log(target)
        if (target) {
          const exists = config.permissions.dj.findIndex((i) => i === target.id);
          // return console.log(exists)
          if (exists < 0) {
            config.permissions.dj.push(target.id);
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                permissions: config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully added dj permissions to ${target}`);
            message.channel.send({embeds: [embed]});
          } else {
            config.permissions.dj.splice(exists, 1);
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                permissions: config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully removed permissions for dj from ${target}`);
            message.channel.send({embeds: [embed]});
          }
        } else {
          message.channel.send('Specified target not found!');
        } // end dj perms

      } else if (msgArr[1].toLowerCase() === 'gaperms') { //start ga perms
        if (message.author.id !== '620196347890499604' && !message.member.hasPermission(['ADMINISTRATOR'])) { return message.reply('You\'re not allowed to use this command!'); }

        const target = message.mentions.roles.first() || message.guild.roles.cache.get(msgArr[2]) || message.mentions.members.first() || message.guild.members.cache.get(msgArr[2]);

        if (target) {
          const exists = config.permissions.giveaways.findIndex((i) => i === target.id);
          if (exists < 0) {
            config.permissions.giveaways.push(target.id);
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                permissions: config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully added permissions for giveaways to ${target}`);
            message.channel.send({embeds: [embed]});
          } else {
            config.permissions.giveaways.splice(exists, 1);
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                permissions: config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully removed permissions for giveaways from ${target}`);
            message.channel.send({embeds: [embed]});
          }
        } else {
          message.channel.send('Specified target not found!');
        } //end ga perms

      } else if (msgArr[1].toLowerCase() === 'modperms') {

        if (message.author.id !== '620196347890499604' && !message.member.hasPermission(['ADMINISTRATOR'])) { return message.reply('You\'re not allowed to use this command!'); }

        const target = message.mentions.roles.first() || message.guild.roles.cache.get(msgArr[1]) || message.mentions.members.first() || message.guild.members.cache.get(msgArr[1]);

        if (target) {
          const exists = config.permissions.moderation.findIndex((i) => i === target.id);
          if (exists < 0) {
            config.permissions.moderation.push(target.id);
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                permissions: config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully added permissions for moderation to ${target}`);
            message.channel.send({embeds: [embed]});
          } else {
            config.permissions.moderation.splice(exists, 1);
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                permissions: config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully removed permissions for moderation from ${target}`);
            message.channel.send({embeds: [embed]});
          }
        } else {
          message.channel.send('Specified target not found!');
        } //end mod perms

      } else if (msgArr[1].toLowerCase() === 'levellog') {
        // start level logging channel
        if (message.author.id !== '620196347890499604' && !message.member.hasPermission(['ADMINISTRATOR'])) { return message.reply('You\'re not allowed to use this command!'); }
        if (msgArr.length === 2) {
          const levelchannel = client.channels.cache.get(client.guildConfig[message.guild.id].channels.levelchannel);
          if (levelchannel) {
            console.log(levelchannel);
            return message.channel.send(`Current levels channel is ${levelchannel}.`);
          } else {
            return message.channel.send('Levels channel not yet set!');
          }
        }

        const targetChannel = message.mentions.channels.first() || client.channels.cache.get(msgArr[2]);

        if (targetChannel) {
          if (targetChannel.guild.id === message.guild.id) {
            config.channels.levelchannel = targetChannel.id;
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                channels: config.channels,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set the levels channel to ${targetChannel}`);
            message.channel.send({embeds: [embed]});
          } else {
            message.channel.send('You can only specify channels within this guild!');
          }
        } else {
          message.channel.send('Specified channel not found!');
        }
        //end level logging channel
      } else if (msgArr[1].toLowerCase() === 'purchaselog') {
        // start treasure logging channel
        if (message.author.id !== '620196347890499604' && !message.member.hasPermission(['ADMINISTRATOR'])) { return message.reply('You\'re not allowed to use this command!'); }
        if (msgArr.length === 2) {
          const purchaselog = client.channels.cache.get(client.guildConfig[message.guild.id].channels.purchaselog);
          if (purchaselog) {
            return message.channel.send(`Current purchase logging channel is ${purchaselog}.`);
          } else {
            return message.channel.send('Purchase logging channel not yet set!');
          }
        }

        const targetChannel = message.mentions.channels.first() || client.channels.cache.get(msgArr[2]);

        if (targetChannel) {
          if (targetChannel.guild.id === message.guild.id) {
            config.channels.purchaselog = targetChannel.id;
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                channels: config.channels,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set the purchase logging channel to ${targetChannel}`);
            message.channel.send({embeds: [embed]});
          } else {
            message.channel.send('You can only specify channels within this guild!');
          }
        } else if (msgArr[2] === 'remove') {
          config.channels.purchaselog = '';
          await client.db.config.updateOne({ id: message.guild.id}, {
            $unset: {
              'channels.purchaselog': ''
            }
          }, { upsert: true }).catch((error) => {
            return message.channel.send('There was an error removing the purchase logging channel from the database.')
          });
          const doneEmbed = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription('Purchase logging channel has been removed.');
          message.channel.send({embeds: [doneEmbed]});
        } else {
          message.channel.send('Specified channel not found!');
        }
        //end treasure logging channel
      } else if (msgArr[1].toLowerCase() === 'prefix') {
        //set prefix start
        if (message.author.id !== '620196347890499604' || !message.member.hasPermission(['ADMINISTRATOR'])) return message.channel.send('You\'re not allowed to use this command!');

        const msgArr = message.content.split(' ');
        const newPrefix = msgArr[2] ? msgArr[2] : null;
        if (!newPrefix) {
          message.channel.send('You must provide the new prefix!');
          return;
        }

        client.db.config.updateOne({ id: message.guild.id },
          {
            $set: {
              prefix: newPrefix,
            },
          });

        config.prefix = newPrefix;
        message.channel.send(`You have changed your prefix to \`${newPrefix}\`!`);
        //end set prefix
      } else if (msgArr[1].toLowerCase() === 'currencyname') {
        // set currency name start
        if (message.author.id !== '620196347890499604' && !message.member.hasPermission('ADMINISTRATOR')) {
          return message.channel.send('You do not have permission to run this command!');
        }
        if (msgArr[2]) {
          client.db.islandinfo.updateOne(
            { guildid: message.guild.id },
            {
              $set: {
                currencyname: msgArr.slice(2).join(' '),
              },
            },
            { upsert: true },
          );
          const embedA = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`Currency name has been set to **${msgArr.slice(2).join(' ')}**!`);
        message.channel.send({embeds: [embedA]});

        } else {
          message.channel.send('You must indicate a name!');
        }
        //end currency name
      } else if (msgArr[1].toLowerCase() === 'welcomechannel') {
        //wc start
        if (message.author.id !== '620196347890499604' && !message.member.hasPermission(['ADMINISTRATOR'])) { return message.reply('You\'re not allowed to use this command!'); }
        if (msgArr.length === 2) {
          const welcomeChannel = client.channels.cache.get(client.guildConfig[message.guild.id].channels.welcomeChannel);
          if (welcomeChannel) {
            return message.channel.send(`Current welcome channel is ${welcomeChannel}.`);
          } else {
            return message.channel.send('Welcome channel not yet set!');
          }
        }

        const targetChannel = message.mentions.channels.first() || client.channels.cache.get(msgArr[1]);

        if (targetChannel) {
          if (targetChannel.guild.id === message.guild.id) {
            config.channels.welcomeChannel = targetChannel.id;
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                channels: config.channels,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set the welcome channel to ${targetChannel}`);
            message.channel.send({embeds: [embed]});
          } else {
            message.channel.send('You can only specify channels within this guild!');
          }
        } else if (msgArr[2] === 'remove') {
          config.channels.welcomeChannel = '';
          await client.db.config.updateOne({ id: message.guild.id}, {
            $unset: {
              'channels.welcomeChannel': ''
            }
          }, { upsert: true }).catch((error) => {
            return message.channel.send('There was an error removing the welcome channel from the database.')
          });
          const doneEmbed = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription('Welcome channel has been removed.');
          message.channel.send({embed: doneEmbed});
        } else {
          message.channel.send('Specified channel not found!');
        }
        //end wc
      } else if (msgArr[1].toLowerCase() === 'welcomeimage') {
        //start wi
        if (message.author.id !== '620196347890499604' && !message.member.hasPermission(['ADMINISTRATOR'])) { return message.reply('You\'re not allowed to use this command!'); }
        if (msgArr.length === 2) {
          const guilddata = await client.db.config.findOne({
            id: message.guild.id,
          });
          if (guilddata.welcomeimage) {
            const embed = new Discord.MessageEmbed()
              .setDescription('Welcome image is set to:');
            try {
              embed.setImage(guilddata.welcomeimage);
            } catch (err) {
              return message.channel.send('That is not a valid image!')
            }
            return message.channel.send({embeds: [embed]});
          } else {
            return message.channel.send('No welcome image has been set!');
          }
        }
        if (msgArr[2].includes('png') || msgArr[2].includes('jpg') || msgArr[2].includes('jpeg')) {
          config.welcomeimage = msgArr[2];
          client.db.config.updateOne({
            id: message.guild.id
          }, {
            $set: {
              welcomeimage: msgArr[2],
            },
          }, {
            upsert: true
          });
          const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set the welcome image to:`);
          try {
            embed.setImage(msgArr[2]);
          } catch (err) {
            return message.channel.send('That is not a valid image!')
          }
          message.channel.send({embeds: [embed]});
        } else if (msgArr[2].toLowerCase() === 'remove') {
          client.db.config.updateOne({
            id: message.guild.id
          }, {
            $unset: {
              welcomeimage: ""
            }
          }, {
            upsert: true
          });
          const doneembed = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription('Welcome image has been removed!');
          message.channel.send({embeds: [doneembed]})
        } else {
          message.channel.send('You must specify an image url!');
        }
          //end wi
      } else if (msgArr[1].toLowerCase() === 'fcrole') {
        // setrole start
        const guild = await client.db.islandinfo.findOne({ guildid: message.guild.id });
        const name = 'roleinfo';
        let description = msgArr[2];
        if (msgArr[2] === 'remove' && (message.member.hasPermission('ADMINISTRATOR') || message.author.id === '620196347890499604')) {
          if (guild) {
            client.db.islandinfo.removeOne({ guildid: message.guild.id });
            message.channel.send(`${message.guild}'s settings have been removed!`);
          }
          return;
        }
        if (msgArr[2] && (message.member.hasPermission('ADMINISTRATOR') || message.author.id === '620196347890499604')) {
        let item;
        if (guild) {
          if (guild.moreinfo) { item = guild.moreinfo.find((entry) => entry.name === name); }
        }
        if (item) {
          item.description = (description.startsWith('<@&')) ? (description.slice(3, -1)) : description;
          const moreinfo = (description.startsWith('<@&')) ? (description.slice(3, -1)) : description;
          const embedA = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`Guild role has been set to **${description.length === 18 ? `<@&${description}>` : description}**!`);
        message.channel.send({embeds: [embedA]});
          client.db.islandinfo.updateOne(
            { guildid: message.guild.id },
            {
              $set: {
                moreinfo: guild.moreinfo,
              },
            },
            { upsert: true },
          );
        } else {
          client.db.islandinfo.updateOne(
            { guildid: message.guild.id },
            {
              $push: {
                moreinfo: {
                  name,
                  description,
                },
              },
            },
            { upsert: true },
          );
        const embedA = new Discord.MessageEmbed()
        .setColor('#7cdda5')
        .setDescription(`Guild role has been set to **<@&${item.description}>**`);
        message.channel.send({embeds: [embedA]});
        }
      } else {
        message.channel.send('You don\'t have permission to run this command.');
      }
      // end setrole
    } else if (msgArr[1].toLowerCase() === 'setlbimage') {
      // set lb image
      const msgArr = message.content.split(' ');
      if (message.author.id !== '620196347890499604' && !message.member.hasPermission(['ADMINISTRATOR'])) { return message.reply('You\'re not allowed to use this command!'); }
      if (msgArr.length === 2) {
        const guilddata = await client.db.config.findOne({
          id: message.guild.id,
        });
        if (guilddata.lbimage) {
          const embed = new Discord.MessageEmbed()
            .setDescription('Leaderboard background is set to:');
          try {
            embed.setImage(guilddata.lbimage);
          } catch (err) {
            return message.channel.send('That is not a valid image!')
          }
          return message.channel.send({embeds: [embed]});
        } else {
          return message.channel.send('No leaderboard background has been set!');
        }
      }
      if (msgArr[2].includes('png') || msgArr[2].includes('jpg') || msgArr[2].includes('jpeg')) {
        config.lbimage = msgArr[2];
        client.db.config.updateOne({
          id: message.guild.id
        }, {
          $set: {
            lbimage: msgArr[2],
          },
        }, {
          upsert: true
        });
        const embed = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription(`You have successfully set the leaderboard background to:`);
        try {
          embed.setImage(msgArr[2]);
        } catch (err) {
          return message.channel.send('That is not a valid image!')
        }
        message.channel.send({embeds: [embed]});
      } else if (msgArr[2].toLowerCase() === 'remove') {
        client.db.config.updateOne({
          id: message.guild.id
        }, {
          $unset: {
            lbimage: ""
          }
        }, {
          upsert: true
        });
        const doneembed = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription('Leaderboard background has been removed!');
        message.channel.send({embed: doneembed})
      } else {
        message.channel.send('You must specify an image url!');
      }
      // set lb image end
    } else if (msgArr[1].toLowerCase() === 'cooldown') {
      // cooldowns
      if (!msgArr[3]) {
        message.channel.send('Configure command cooldown using ;setcooldown <command_name> <duration_in_ms>');
        return;
      }
      const command = client.commands.get(msgArr[2].toLowerCase());
      if (command) {
        const duration = parseInt(msgArr[3], 10);
        if (isNaN(duration)) {
          message.channel.send('cCnfigure command cooldown using ;setcooldown <command_name> <duration_in_ms>');
          return;
        }
        message.channel.send('Settings have been successfully applied!');
        if (!config.cooldowns) {
          config.cooldowns = {};
        }
        config.cooldowns[command.name] = duration;
        await client.db.config.updateOne({ id: message.guild.id }, { $set: { cooldowns: config.cooldowns } }, { upsert: true });
      } else {
        message.channel.send('Command not found!');
      }
      //end cooldowns
    } else if (msgArr[1].toLowerCase() === 'requirefc') {
      if (message.author.id !== '620196347890499604' && !message.member.hasPermission('ADMINISTRATOR')) {
        return message.channel.send('You do not have permission to run this command!');
      }
      if (msgArr[2] === 'true' || msgArr[2] === 'false') {
        client.db.islandinfo.updateOne(
          { guildid: message.guild.id },
          {
            $set: {
              friendcoderequirement: msgArr[2],
            },
          },
          { upsert: true },
        );
        const embedA = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setDescription(`Friend code requirement has been set to **${msgArr[2]}**!`);
      message.channel.send({embeds: [embedA]});

      } else {
        message.channel.send('You must indicate true / false!');
      }
    } else if (msgArr[1].toLowerCase() === 'togglerole') {

      if (!message.member.hasPermission(['ADMINISTRATOR'])) { message.reply('You\'re not allowed to use this command!'); return; }
      config.togglerole = !config.togglerole;
      message.channel.send('Level up role toggle has been applied!');
      await client.db.config.updateOne({ id: message.guild.id }, { $set: { togglerole: config.togglerole } }, { upsert: true });

    } else if (msgArr[1].toLowerCase() === 'djmode') {
      //dj on or off start
      if (msgArr.length >= 1) {
        const guilddata = await client.db.config.findOne({
          id: message.guild.id,
        });
        if (!msgArr[2]) {
          return message.channel.send(`DJ mode is set to **${guilddata.djon}**!`);
        } else {
          if (msgArr[2].toLowerCase() === 'true' || msgArr[2].toLowerCase() === 'false') {
            config.djon = msgArr[2];
            client.db.config.updateOne({ id: message.guild.id }, {
              $set: {
                djon: msgArr[2],
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set DJ mode to ${msgArr[2]}!`);
            message.channel.send({embeds: [embed]});
          } else if (!guilddata) {
            return message.channel.send('DJ mode is set to **true**!');
          } else {
            message.channel.send('You can only specify true or false!');
          }
        }
      }
      //dj end
    }  else if (msgArr[1].toLowerCase() === 'messagelog') {
        if (message.author.id !== '620196347890499604' && !message.member.hasPermission('ADMINISTRATOR')) {
          return message.channel.send('You do not have permission to run this command!');
        }
        if (msgArr[2] === 'true' || msgArr[2] === 'false') {
          client.db.islandinfo.updateOne(
            { guildid: message.guild.id },
            {
              $set: {
                messagelog: msgArr[2],
              },
            },
            { upsert: true },
          );
          const embedA = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`Message deletion log has been set to **${msgArr[2]}**!`);
        message.channel.send({embeds: [embedA]});

        } else {
          message.channel.send('You must indicate true / false!');
        }
    } else {
      const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription('**Configuration not found. Available configurations are:** \neconomy\ntogglerole\ncooldown\ntogglefc\nfcrole\nprefix\ndjperms\ndjmode\nmodperms\ngaperms\nlevellog\npurchaselog\nwelcomechannel\nwelcomeimage\nsetlbimage')
      return message.channel.send({embeds: [embed]})

  }
  }
  },
};

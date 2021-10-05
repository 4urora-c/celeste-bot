/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Server configuration command')
    .setDefaultPermission(false)
    .addStringOption(option =>
      option
        .setName('config')
        .setDescription('Input configuration here')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('second')
        .setDescription('Second argument'))
        .addStringOption(option =>
          option
            .setName('third')
            .setDescription('Third argument')),
  async execute(interaction) {
    const t = interaction.options.getString('config')
    const ar = interaction.options.getString('second')
    const tr = interaction.options.getString('third')
    if (t) {

      if (t.toLowerCase() === 'economy') {
        const guilddata = await interaction.client.db.config.findOne({
          id: interaction.guild.id,
        });
        if (!ar) {
          return interaction.reply(`Economy is set to **${guilddata.economy}**!`);
        } else {
          if (ar.toLowerCase() === 'true' || ar.toLowerCase() === 'false') {
            interaction.client.db.config.economy = ar;
            interaction.client.db.config.updateOne({ id: interaction.guild.id }, {
              $set: {
                economy: ar,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set economy to ${ar}!`);
            interaction.reply({embeds: [embed]});
          } else if (!guilddata) {
            return interaction.reply('Economy is set to **true**!');
          } else {
            interaction.reply('You can only specify true or false!');
          }
        }
      }
        // end economy
      } else if (t.toLowerCase() === 'welcomerole') {
        const target = ar.mentions.roles.first() || interaction.guild.roles.cache.get(ar);

        if (target) {
          const exists = interaction.client.db.config.permissions.joinrole.findIndex((i) => i === target.id);
          if (exists < 0) {
            config.permissions.joinrole.push(target.id);
            interaction.client.db.config.updateOne({ id: interaction.guild.id }, {
              $set: {
                permissions: interaction.client.db.config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully added ${target} to the join roles.`);
            interaction.reply({embeds: [embed]});
          } else {
            config.permissions.joinrole.splice(exists, 1);
            interaction.client.db.config.updateOne({ id: interaction.guild.id }, {
              $set: {
                permissions: interaction.client.db.config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully removed ${target} from the join roles.`);
            interaction.reply({embeds: [embed]});
          }
        } else {
          interaction.reply('Specified target not found!');
        } //end ga perms

      } else if (t.toLowerCase() === 'gaperms') { //start ga perms
        const target = ar.mentions.roles.first() || interaction.guild.roles.cache.get(ar) || ar.mentions.members.first() || interaction.guild.members.cache.get(ar);

        if (target) {
          const exists = interaction.client.db.config.permissions.giveaways.findIndex((i) => i === target.id);
          if (exists < 0) {
            config.permissions.giveaways.push(target.id);
            interaction.client.db.config.updateOne({ id: interaction.guild.id }, {
              $set: {
                permissions: interaction.client.db.config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully added permissions for giveaways to ${target}`);
            interaction.reply({embeds: [embed]});
          } else {
            config.permissions.giveaways.splice(exists, 1);
            interaction.client.db.config.updateOne({ id: interaction.guild.id }, {
              $set: {
                permissions: interaction.client.db.config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully removed permissions for giveaways from ${target}`);
            interaction.reply({embeds: [embed]});
          }
        } else {
          interaction.reply('Specified target not found!');
        } //end ga perms

      } else if (t.toLowerCase() === 'modperms') {

        const target = ar.mentions.roles.first() || interaction.guild.roles.cache.get(ar) || ar.mentions.members.first() || interaction.guild.members.cache.get(ar);

        if (target) {
          const exists = config.permissions.moderation.findIndex((i) => i === target.id);
          if (exists < 0) {
            config.permissions.moderation.push(target.id);
            interaction.client.db.config.updateOne({ id: interaction.guild.id }, {
              $set: {
                permissions: interaction.client.db.config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully added permissions for moderation to ${target}`);
            interaction.reply({embeds: [embed]});
          } else {
            config.permissions.moderation.splice(exists, 1);
            interaction.client.db.config.updateOne({ id: interaction.guild.id }, {
              $set: {
                permissions: interaction.client.db.config.permissions,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully removed permissions for moderation from ${target}`);
            interaction.reply({embeds: [embed]});
          }
        } else {
          interaction.reply('Specified target not found!');
        } //end mod perms

      } else if (t.toLowerCase() === 'levellog') {
        // start level logging channel
        if (ar) {
          const levelchannel = interaction.client.channels.cache.get(interaction.client.guildConfig[interaction.guild.id].channels.levelchannel);
          if (levelchannel) {
            console.log(levelchannel);
            return interaction.reply(`Current levels channel is ${levelchannel}.`);
          } else {
            return interaction.reply('Levels channel not yet set!');
          }
        }

        const targetChannel = ar.mentions.channels.first() || interaction.client.channels.cache.get(ar);

        if (targetChannel) {
          if (targetChannel.guild.id === interaction.guild.id) {
            config.channels.levelchannel = targetChannel.id;
            interaction.client.db.config.updateOne({ id: interaction.guild.id }, {
              $set: {
                channels: interaction.client.db.config.channels,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set the levels channel to ${targetChannel}`);
            interaction.reply({embeds: [embed]});
          } else {
            interaction.reply('You can only specify channels within this guild!');
          }
        } else {
          interaction.reply('Specified channel not found!');
        }
        //end level logging channel
      } else if (t.toLowerCase() === 'purchaselog') {
        // start treasure logging channel
        if (ar) {
          const purchaselog = interaction.client.channels.cache.get(interaction.client.guildConfig[interaction.guild.id].channels.purchaselog);
          if (purchaselog) {
            return interaction.reply(`Current purchase logging channel is ${purchaselog}.`);
          } else {
            return interaction.reply('Purchase logging channel not yet set!');
          }
        }

        const targetChannel = ar.mentions.channels.first() || interaction.client.channels.cache.get(ar);

        if (targetChannel) {
          if (targetChannel.guild.id === interaction.guild.id) {
            config.channels.purchaselog = targetChannel.id;
            interaction.client.db.config.updateOne({ id: interaction.guild.id }, {
              $set: {
                channels: interaction.client.db.config.channels,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set the purchase logging channel to ${targetChannel}`);
            interaction.reply({embeds: [embed]});
          } else {
            interaction.reply('You can only specify channels within this guild!');
          }
        } else if (ar === 'remove') {
          config.channels.purchaselog = '';
          await interaction.client.db.config.updateOne({ id: interaction.guild.id}, {
            $unset: {
              'channels.purchaselog': ''
            }
          }, { upsert: true }).catch((error) => {
            return interaction.reply('There was an error removing the purchase logging channel from the database.')
          });
          const doneEmbed = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription('Purchase logging channel has been removed.');
          interaction.reply({embeds: [doneEmbed]});
        } else {
          interaction.reply('Specified channel not found!');
        }
        //end treasure logging channel
      } else if (t.toLowerCase() === 'prefix') {
        //set prefix start
        const newPrefix = ar ? ar : null;
        if (!newPrefix) {
          interaction.reply('You must provide the new prefix!');
          return;
        }

        interaction.client.db.config.updateOne({ id: interaction.guild.id },
          {
            $set: {
              prefix: newPrefix,
            },
          });

        interaction.client.db.config.prefix = newPrefix;
        interaction.reply(`You have changed your prefix to \`${newPrefix}\`!`);
        //end set prefix
      } else if (t.toLowerCase() === 'currencyname') {
        // set currency name start

        if (ar) {
          interaction.client.db.islandinfo.updateOne(
            { guildid: interaction.guild.id },
            {
              $set: {
                currencyname: ar,
              },
            },
            { upsert: true },
          );
          const embedA = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`Currency name has been set to **${ar}**!`);
        interaction.reply({embeds: [embedA]});

        } else {
          interaction.reply('You must indicate a name!');
        }
        //end currency name
      } else if (t.toLowerCase() === 'welcomechannel') {
        //wc start
        if (ar) {
          const welcomeChannel = interaction.client.channels.cache.get(interaction.client.guildConfig[interaction.guild.id].channels.welcomeChannel);
          if (welcomeChannel) {
            return;
          } else {
            return interaction.reply('Welcome channel not yet set!');
          }
        }

        const targetChannel = ar.mentions.channels.first() || interaction.client.channels.cache.get(ar);

        if (targetChannel) {
          if (targetChannel.guild.id === interaction.guild.id) {
            config.channels.welcomeChannel = targetChannel.id;
            interaction.client.db.config.updateOne({ id: interaction.guild.id }, {
              $set: {
                channels: interaction.client.db.config.channels,
              },
            }, { upsert: true });
            const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set the welcome channel to ${targetChannel}`);
            interaction.reply({embeds: [embed]});
          } else {
            interaction.reply('You can only specify channels within this guild!');
          }
        } else if (ar === 'remove') {
          config.channels.welcomeChannel = '';
          await interaction.client.db.config.updateOne({ id: interaction.guild.id}, {
            $unset: {
              'channels.welcomeChannel': ''
            }
          }, { upsert: true }).catch((error) => {
            return interaction.reply('There was an error removing the welcome channel from the database.')
          });
          const doneEmbed = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription('Welcome channel has been removed.');
          interaction.reply({embeds: [doneEmbed]});
        } else {
          interaction.reply('Specified channel not found!');
        }
        //end wc
      } else if (t.toLowerCase() === 'welcomeimage') {
        //start wi
        if (ar) {
          const guilddata = await interaction.client.db.config.findOne({
            id: interaction.guild.id,
          });
          if (guilddata.welcomeimage) {
            const embed = new Discord.MessageEmbed()
              .setDescription('Welcome image is set to:');
            try {
              embed.setImage(guilddata.welcomeimage);
            } catch (err) {
              return interaction.reply('That is not a valid image!')
            }
            return interaction.reply({embeds: [embed]});
          } else {
            return interaction.reply('No welcome image has been set!');
          }
        }
        if (ar.includes('png') || ar.includes('jpg') || ar.includes('jpeg')) {
          interaction.client.db.config.welcomeimage = ar;
          interaction.client.db.config.updateOne({
            id: interaction.guild.id
          }, {
            $set: {
              welcomeimage: ar,
            },
          }, {
            upsert: true
          });
          const embed = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`You have successfully set the welcome image to:`);
          try {
            embed.setImage(ar);
          } catch (err) {
            return interaction.reply('That is not a valid image!')
          }
          interaction.reply({embeds: [embed]});
        } else if (ar.toLowerCase() === 'remove') {
          interaction.client.db.config.updateOne({
            id: interaction.guild.id
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
          interaction.reply({embeds: [doneembed]})
        } else {
          interaction.reply('You must specify an image url!');
        }
          //end wi
      } else if (t.toLowerCase() === 'fcrole') {
        // setrole start
        try {
        const guild = await interaction.client.db.islandinfo.findOne({ guildid: interaction.guild.id });
        const name = 'roleinfo';
        let description = ar;
        if (ar === 'remove') {
          if (guild) {
            interaction.client.db.islandinfo.removeOne({ guildid: interaction.guild.id });
            interaction.reply(`${interaction.guild}'s settings have been removed!`);
          }
          return;
        }
        if (ar) {
        let item = interaction.guild.roles.cache.get(r => r.id === ar) || interaction.guild.roles.cache.get(r => r.name === ar)
        if (guild) {
          if (guild.moreinfo) { item = guild.moreinfo.find((entry) => entry.name === name); }
        }
        if (item) {
          item.description = item.id;
          const moreinfo = item.id;
          const embedA = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`Guild role has been set to **${item}**!`);
        interaction.reply({embeds: [embedA]});
          interaction.client.db.islandinfo.updateOne(
            { guildid: interaction.guild.id },
            {
              $set: {
                moreinfo: guild.moreinfo,
              },
            },
            { upsert: true },
          );
        } else {
          interaction.client.db.islandinfo.updateOne(
            { guildid: interaction.guild.id },
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
        interaction.reply({embeds: [embedA]});
        }
      } } catch(e) {console.log(e.stack)}
      // end setrole
    } if (t.toLowerCase() === 'setlbimage') {
      // set lb image
      if (ar) {
        const guilddata = await interaction.client.db.config.findOne({
          id: interaction.guild.id,
        });
        if (guilddata.lbimage) {
          const embed = new Discord.MessageEmbed()
            .setDescription('Leaderboard background is set to:');
          try {
            embed.setImage(guilddata.lbimage);
          } catch (err) {
            return interaction.reply('That is not a valid image!')
          }
          return interaction.reply({embeds: [embed]});
        } else {
          return interaction.reply('No leaderboard background has been set!');
        }
      }
      if (ar.includes('png') || ar.includes('jpg') || ar.includes('jpeg')) {
        interaction.client.db.config.lbimage = ar;
        interaction.client.db.config.updateOne({
          id: interaction.guild.id
        }, {
          $set: {
            lbimage: ar,
          },
        }, {
          upsert: true
        });
        const embed = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription(`You have successfully set the leaderboard background to:`);
        try {
          embed.setImage(ar);
        } catch (err) {
          return interaction.reply('That is not a valid image!')
        }
        interaction.reply({embeds: [embed]});
      } else if (ar.toLowerCase() === 'remove') {
        interaction.client.db.config.updateOne({
          id: interaction.guild.id
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
        interaction.reply({embed: doneembed})
      } else {
        interaction.reply('You must specify an image url!');
      }
      // set lb image end
    } else if (t.toLowerCase() === 'cooldown') {
      // cooldowns
      if (!tr) {
        interaction.reply('Configure command cooldown using ;setcooldown <command_name> <duration_in_ms>');
        return;
      }
      const command = interaction.client.commands.get(ar.toLowerCase());
      if (command) {
        const duration = parseInt(tr, 10);
        if (isNaN(duration)) {
          interaction.reply('Configure command cooldown using ;setcooldown <command_name> <duration_in_ms>');
          return;
        }
        interaction.reply('Settings have been successfully applied!');
        if (!interaction.client.db.config.cooldowns) {
          interaction.client.db.config.cooldowns = {};
        }
        interaction.client.db.config.cooldowns[command.name] = duration;
        await interaction.client.db.config.updateOne({ id: interaction.guild.id }, { $set: { cooldowns: interaction.client.db.config.cooldowns } }, { upsert: true });
      } else {
        interaction.reply('Command not found!');
      }
      //end cooldowns
    } else if (t.toLowerCase() === 'requirefc') {

      if (ar === 'true' || ar === 'false') {
        interaction.client.db.islandinfo.updateOne(
          { guildid: interaction.guild.id },
          {
            $set: {
              friendcoderequirement: ar,
            },
          },
          { upsert: true },
        );
        const embedA = new Discord.MessageEmbed()
      .setColor('#5b4194')
      .setDescription(`Friend code requirement has been set to **${ar}**!`);
      interaction.reply({embeds: [embedA]});

      } else {
        interaction.reply('You must indicate true / false!');
      }
    } else if (t.toLowerCase() === 'togglerole') {
      config.togglerole = !config.togglerole;
      interaction.reply('Level up role toggle has been applied!');
      await interaction.client.db.config.updateOne({ id: interaction.guild.id }, { $set: { togglerole: config.togglerole } }, { upsert: true });

    }  else if (t.toLowerCase() === 'messagelog') {
        if (ar === 'true' || ar === 'false') {
          interaction.client.db.islandinfo.updateOne(
            { guildid: interaction.guild.id },
            {
              $set: {
                messagelog: ar,
              },
            },
            { upsert: true },
          );
          const embedA = new Discord.MessageEmbed()
        .setColor('#5b4194')
        .setDescription(`Message deletion log has been set to **${ar}**!`);
        interaction.reply({embeds: [embedA]});

      } else {
      const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription('**Configuration not found. Available configurations are:** \neconomy\ntogglerole\ncooldown\ntogglefc\nfcrole\nprefix\ndjperms\ndjmode\nmodperms\ngaperms\nlevellog\npurchaselog\nwelcomechannel\nwelcomeimage\nsetlbimage')
      return interaction.reply({embeds: [embed]})

  }
}

  },
};

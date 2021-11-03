/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const data = [['character name', 'This is the name of your island character.'], ['island name', 'This is the name of your island.'], ['friend code', 'This is your friend code, found on your Switch profile.'], ['dream address', 'This is your dream address, found by sleeping in a bed and uploading your island.']]
module.exports = {
  data: new SlashCommandBuilder()
    .setName('alt')
    .setDescription('Check alt info with this command')
    .setDefaultPermission(false)
    .addSubcommand(subcommand =>
      subcommand
        .setName('island')
        .setDescription('Check alt island info with this command')
        .addUserOption(option =>
          option
            .setName('target')
            .setDescription('The user whose info you want to check')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Add your alt information to the Celeste database')
        .addStringOption(option =>
          option
            .setName('setting')
            .setDescription('Choose which item to input')
            .addChoices(data)
            .setRequired(true))
        .addStringOption(option =>
          option
            .setName('info')
            .setDescription('Input your information here')
            .setRequired(true))),
  async execute(interaction)  {
    if (interaction.options.getSubcommand() === 'island') {
    const user = interaction.options.getUser('target');
    if (user) {
      const userdata = await interaction.client.db.islandinfo.findOne({ id: user.id });
      if (userdata) {
        const embed = new MessageEmbed()
          .setTitle('User Info (Alt)')
          .setAuthor(user.tag, user.displayAvatarURL())
          .setThumbnail(user.avatarURL());

        if (userdata.altname) {
          embed.addField('Name', userdata.altname);
        }
        if (userdata.altinfo) {
          userdata.altinfo.sort((a, b) => {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
          }).forEach((info) => {
            embed.addField(info.name, info.description);
          });
        }
        if (userdata.alts) {
          embed.addField('Alt Account', userdata.alts);
        }
                interaction.reply({embeds: [embed]});
      }
      } else if (!user) {
        const userdata = await interaction.client.db.islandinfo.findOne({ id: interaction.member.id });
        if (userdata) {
          const embed = new MessageEmbed()
            .setTitle('User Info (Alt)')
            .setAuthor(interaction.member.user.tag, interaction.member.user.displayAvatarURL())
            .setThumbnail(interaction.member.user.avatarURL());

          if (userdata.altname) {
            embed.addField('Name', userdata.altname);
          }
          if (userdata.altinfo) {
            userdata.altinfo.sort((a, b) => {
              if (a.name > b.name) { return -1; }
              if (a.name < b.name) { return 1; }
              return 0;
            }).forEach((info) => {
              embed.addField(info.name, info.description);
            });
          }
          if (userdata.alts) {
            embed.addField('Alt Account', userdata.alts);
          }
          interaction.reply({embeds: [embed]});
        }
      } else {
        interaction.reply({content: 'Specified user doesn\'t have any alt island info!'});
      }
    } else if(interaction.options.getSubcommand() === 'set') {
      // set command for alts
      const setting = interaction.options.getString('setting')
      const info = interaction.options.getString('info')
      if (setting === 'This is the name of your island.') {
        const name = 'Island';
        const user = await interaction.client.db.islandinfo.findOne({id: interaction.member.id})
        let item;
        if (user) {
          if (user.altinfo) {
            item = user.altinfo.find((entry) => entry.name === name);
          }
        }
        if (item) {
          item.description = info;
          const embedA = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`**${info}** has been set as your alt island name!`);
          interaction.reply({
            embeds: [embedA],
          });
          interaction.client.db.islandinfo.updateOne({
            id: interaction.member.id,
          }, {
            $set: {
              altinfo: user.altinfo,
            },
          }, {
            upsert: true,
          });
        } else {
          let altinfo = {};
          let description = info;
          altinfo.description = info;
          interaction.client.db.islandinfo.updateOne({
            id: interaction.member.id,
          }, {
            $push: {
              altinfo: {
                name,
                description,
              },
            },
          }, {
            upsert: true,
          });
          const embedA = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`**${info}** has been set as your alt island name!`);
          interaction.reply({
            embeds: [embedA],
          });
        }
      }
      else if (setting === 'This is the name of your island character.') {
        const guilddata2 = await interaction.client.db.islandinfo.findOne({
          guildid: interaction.guild.id,
        });
        const userdata2 = await interaction.client.db.islandinfo.findOne({ id: interaction.member.id });
          if (info.length > 10) {
            return interaction.reply({content: 'This name is too long!'})
          }
          interaction.client.db.islandinfo.updateOne(
            { id: interaction.member.id },
            {
              $set: {
                altname: info,
              },
            },
            { upsert: true },
          );
          const embedA = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`Your alt name has been set to **${info}**!`);
          interaction.reply({ embeds: [embedA] });
        }
        else if (setting === 'This is your dream address, found by sleeping in a bed and uploading your island.') {
          let name = 'DA';

          if (name.toLowerCase() === 'da') {
            const isNum = /^\d+$/.test(info);
            if (!isNum || info.length !== 12) {
              interaction.reply({content: 'Dream address must be 12 digits!'});
              return;
            }
            description = `DA-${info.slice(0, 4)}-${info.slice(4, 8)}-${info.slice(8, 12)}`;
          } else {
            name = 'DA';
          }

          const user = await interaction.client.db.islandinfo.findOne({
            id: interaction.member.id,
          });
          let item;
          if (user) {
            if (user.altinfo) {
              item = user.altinfo.find((entry) => entry.name === name);
            }
          }
          if (item) {
            item.description = description;
            const embedA = new Discord.MessageEmbed()
              .setColor('#5b4194')
              .setDescription(`**DA-${info.slice(0, 4)}-${info.slice(4, 8)}-${info.slice(8, 12)}** has been set as your alt dream address!`);
            interaction.reply({
              embeds: [embedA],
            });
            interaction.client.db.islandinfo.updateOne({
              id: interaction.member.id,
            }, {
              $set: {
                altinfo: user.altinfo,
              },
            }, {
              upsert: true,
            });
          } else {
            interaction.client.db.islandinfo.updateOne({
              id: interaction.member.id,
            }, {
              $push: {
                altinfo: {
                  name,
                  description,
                },
              },
            }, {
              upsert: true,
            });
            const embedA = new Discord.MessageEmbed()
              .setColor('#5b4194')
              .setDescription(`**DA-${info.slice(0, 4)}-${info.slice(4, 8)}-${info.slice(8, 12)}** has been set as your alt dream address!`);
            interaction.reply({
              embeds: [embedA],
            });
          }
        }
      else if (setting === 'This is your friend code, found on your Switch profile.') {

                let name = 'Friend Code';

                if (name === 'Friend Code') {
                  const isNum = /^\d+$/.test(info);
                  if (!isNum || info.length !== 12) {
                    interaction.reply({content: 'Friend code must be 12 digits!'} );
                    return;
                  }
                  description = `SW-${info.slice(0, 4)}-${info.slice(4, 8)}-${info.slice(8, 12)}`;
                } else {
                  name = "Friend Code";
                }

                const user = await interaction.client.db.islandinfo.findOne({
                  id: interaction.member.id
                });
                let item;
                if (user) {
                  if (user.altinfo) {
                    item = user.altinfo.find((entry) => entry.name === name);
                  }
                }
                if (item) {
                  item.description = description;
                  const embedA = new Discord.MessageEmbed()
                    .setColor('#5b4194')
                    .setDescription(`**SW-${info.slice(0, 4)}-${info.slice(4, 8)}-${info.slice(8, 12)}** has been set as your alt profile friend code!`);
                  interaction.reply({
                    embeds: [embedA]
                  });
                  interaction.client.db.islandinfo.updateOne({
                    id: interaction.member.id
                  }, {
                    $set: {
                      altinfo: user.altinfo,
                    },
                  }, {
                    upsert: true
                  }, );
                } else {
                  interaction.client.db.islandinfo.updateOne({
                    id: interaction.member.id
                  }, {
                    $push: {
                      altinfo: {
                        name,
                        description,
                      },
                    },
                  }, {
                    upsert: true
                  }, );
                  const embedA = new Discord.MessageEmbed()
                    .setColor('#5b4194')
                    .setDescription(`**SW-${info.slice(0, 4)}-${info.slice(4, 8)}-${info.slice(8, 12)}** has been set as your alt profile friend code!`);
                  interaction.reply({
                    embeds: [embedA]
                  });
                }
        }


    }
    }
}

/* eslint-disable no-console */
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const data = [['character name', 'This is the name of your island character.'], ['island name', 'This is the name of your island.'], ['friend code', 'This is your friend code, found on your Switch profile.'], ['dream address', 'This is your dream address, found by sleeping in a bed and uploading your island.']]
module.exports = {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('Add your information to the Celeste database')
    .setDefaultPermission(false)
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
        .setRequired(true)),
   async execute(interaction) {
    const setting = interaction.options.getString('setting')
    const info = interaction.options.getString('info')
    if (setting === 'This is the name of your island.') {
      const name = 'Island';
      const user = await interaction.client.db.islandinfo.findOne({id: interaction.member.id})
      let item;
      if (user) {
        if (user.moreinfo) {
          item = user.moreinfo.find((entry) => entry.name === name);
        }
      }
      if (item) {
        item.description = info;
        const embedA = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription(`**${info}** has been set as your island name!`);
        interaction.reply({
          embeds: [embedA],
        });
        interaction.client.db.islandinfo.updateOne({
          id: interaction.member.id,
        }, {
          $set: {
            moreinfo: user.moreinfo,
          },
        }, {
          upsert: true,
        });
      } else {
        let moreinfo = {};
        let description = info;
        moreinfo.description = info;
        interaction.client.db.islandinfo.updateOne({
          id: interaction.member.id,
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
          .setDescription(`**${info}** has been set as your island name!`);
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
              name: info,
            },
          },
          { upsert: true },
        );
        const embedA = new Discord.MessageEmbed()
          .setColor('#5b4194')
          .setDescription(`Your name has been set to **${info}**!`);
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
          if (user.moreinfo) {
            item = user.moreinfo.find((entry) => entry.name === name);
          }
        }
        if (item) {
          item.description = description;
          const embedA = new Discord.MessageEmbed()
            .setColor('#5b4194')
            .setDescription(`**DA-${info.slice(0, 4)}-${info.slice(4, 8)}-${info.slice(8, 12)}** has been set as your dream address!`);
          interaction.reply({
            embeds: [embedA],
          });
          interaction.client.db.islandinfo.updateOne({
            id: interaction.author.id,
          }, {
            $set: {
              moreinfo: user.moreinfo,
            },
          }, {
            upsert: true,
          });
        } else {
          interaction.client.db.islandinfo.updateOne({
            id: interaction.member.id,
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
            .setDescription(`**DA-${info.slice(0, 4)}-${info.slice(4, 8)}-${info.slice(8, 12)}** has been set as your dream address!`);
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
                if (user.moreinfo) {
                  item = user.moreinfo.find((entry) => entry.name === name);
                }
              }
              if (item) {
                item.description = description;
                const embedA = new Discord.MessageEmbed()
                  .setColor('#5b4194')
                  .setDescription(`**SW-${info.slice(0, 4)}-${info.slice(4, 8)}-${info.slice(8, 12)}** has been set as your friend code!`);
                interaction.reply({
                  embeds: [embedA]
                });
                interaction.client.db.islandinfo.updateOne({
                  id: interaction.member.id
                }, {
                  $set: {
                    moreinfo: user.moreinfo,
                  },
                }, {
                  upsert: true
                }, );
              } else {
                interaction.client.db.islandinfo.updateOne({
                  id: interaction.member.id
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
                  .setDescription(`**SW-${info.slice(0, 4)}-${info.slice(4, 8)}-${info.slice(8, 12)}** has been set as your friend code!`);
                interaction.reply({
                  embeds: [embedA]
                });
              }
              try {
                const guilddata = await interaction.client.db.islandinfo.findOne({
                  guildid: interaction.guild.id
                });
                if (guilddata.friendcoderequirement === 'true') {
                  const exists = await interaction.client.db.islandinfo.findOne({
                    guildid: interaction.guild.id.guildid
                  });
                  if (exists) {
                    if (guilddata.moreinfo[0].name === 'roleinfo') {
                      interaction.member.roles.add(`${guilddata.moreinfo[0].description}`);
                    } else if (guilddata.moreinfo[1].name === 'roleinfo') {
                      interaction.member.roles.add(`${guilddata.moreinfo[1].description}`);
                    }
                  }
                }
              } catch (err) {
                //console.log(`No role or friend code setting found for server ${message.guild}`)
                console.log(err.stack)
                return;
              }
      }


  },
};

/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

module.exports = {
  name: 'addreactionrole',
  description: 'Add react role to reaction embed',
  aliases: 'arr',
  usage: 'addreactrole <messageID>',
  execute: async (client, message) => {
    let reactRoleObj;
    let currentBotMessage;
    message.delete();
    const msgArr = message.content.split(' ');
        if (message.author.id !== '620196347890499604' && !message.member.roles.cache.some((r) => config.permissions.moderation.includes(r.id) || message.member.permissions.has('ADMINISTRATOR'))) { return message.reply('You\'re not allowed to use this command!'); }
    if (msgArr.length === 2) {
      if (msgArr[1]) {
        await message.channel.messages.fetch(msgArr[1]);
        const reactionMessage = message.channel.messages.cache.get(msgArr[1]);
        reactRoleObj = client.reactrolelocal.find((obj) => obj.id === reactionMessage.id);
        if (reactRoleObj) {
          if (reactionMessage.embeds.length > 0) {
            const reactionEmbed = reactionMessage.embeds[0];
            currentBotMessage = await message.channel.send('> Input the role name');
            const filter = (m) => m.author.id === message.author.id;
            const filter2 = (r, u) => u.id === message.author.id;
            message.channel.awaitMessages({
              filter,
              max: 1,
              time: 1000 * 60 * 60,
              errors: [],
            }).then(async (collected) => {
              const collectedMessage = collected.first();
              const role = message.guild.roles.cache.find((guildRole) => guildRole.name.toLowerCase() === collectedMessage.content.toLowerCase());
              collectedMessage.delete();
              currentBotMessage.delete();
              if (role) {
                await message.channel.send('> React the reaction you want to use in this message').then((newMessage) => {
                  newMessage.awaitReactions({
                    filter2,
                    max: 1,
                    time: 1000 * 60 * 60,
                    errors: [],
                  }).then(async (collected2) => {
                    let isReactionFound = 0;
                    const collectedReaction = collected2.first();
                    newMessage.delete();
                    Object.keys(reactRoleObj.roles).forEach((r) => {
                      if (reactRoleObj.roles[r].emoji === collectedReaction.emoji.name) { isReactionFound = 1; }
                    });
                    if (isReactionFound) {
                      message.channel.send(`> ${collectedReaction.emoji.name} REACTION ALREADY EXISTS`);
                    } else {
                      let error = 0;
                      const selectedEmoji = collectedReaction.emoji.id || collectedReaction.emoji.name;
                      const emojiDisplay = collectedReaction.emoji.id ? `<${collectedReaction.emoji.animated ? 'a' : ''}:${collectedReaction.emoji.name}:${collectedReaction.emoji.id}>` : collectedReaction.emoji.name;
                      await reactionMessage.react(selectedEmoji).catch(() => {
                        message.channel.send('Error! Emoji doesn\'t exist on bot');
                        error = 1;
                      });
                      if (error) return;
                      reactionEmbed.setDescription(`${reactionEmbed.description}\n\n${emojiDisplay} - ${role}`);
                      reactRoleObj.roles[selectedEmoji] = {
                        roleId: role.id,
                        roleName: role.name,
                        emoji: selectedEmoji,
                      };
                      reactionMessage.edit({ embeds: [reactionEmbed]});
                      console.log(reactRoleObj.roles);
                      await client.db.reactrole.updateOne(
                        { id: msgArr[1] },
                        {
                          $set: {
                            roles: { ...reactRoleObj.roles },
                          },
                        },
                        { upsert: true },
                      );
                    }
                  });
                });
              } else {
                message.channel.send('> ROLE DOESN\'T EXIST');
              }
            });
          } else {
            message.channel.send('> React Role Embed doesn\'t exist!');
          }
        } else {
          message.channel.send('> React Role Embed doesn\'t exist!');
        }
      } else {
        message.channel.send('> React Role Embed doesn\'t exist!');
      }
    }
  },
};

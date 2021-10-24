/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
module.exports = (client, distube, reaction, user) => {
  if (client.reactrolelocal) {
    const reactRoleObj = client.reactrolelocal.find((item) => item.id === reaction.message.id);
    if (reactRoleObj) {
      const selectedEmoji = reactRoleObj.roles[reaction.emoji.id || reaction.emoji.name];
      if (selectedEmoji) {
        const currentUser = client.guilds.cache.get(reaction.message.guild.id)?.members.cache.get(user.id);
        if (currentUser) {
          currentUser.roles.add(selectedEmoji.roleId);
        }
      }
    }
  }
};

const commandsToSetPermissions = ['ban, reactionrole', 'warn'];
const adminCommands = ['refresh', 'ban', 'reactionrole', 'add', 'config', 'friendcoderole', 'remove', 'warn', 'steal', 'restart'];
const basicdeny = ['join'];
const basicallow = ['leaderboard', 'profile', 'island', 'set', 'balance', 'blackjack', 'stonks']
const supportercommands = ['setcolour']
module.exports = {
    async refreshCommandPermissionsClient(client) {
        let guildCounter = 0;
        let commandCounter = 0;
        for (guild of client.guilds.cache) {
            const currentGuild = await client.guilds.cache.get(guild[0]);
            const commands = await currentGuild.commands.fetch();
            for (command of commands) {
                //console.log(command[comm]);
                const currentCommand = await currentGuild?.commands.fetch(command[0]);
                if (commandsToSetPermissions.includes(currentCommand.name)) {
                    console.log('Refreshed permissions in ' + currentGuild.name + " for " + currentCommand.name);
                    const permissions = [
                      /*  {
                            id: currentGuild?.roles.everyone.id,        //paste here ID of administrator
                            type: 'ROLE',
                            permission: false                           //set whether should be able to use or not
                        },*/
                        {
                            id: '620196347890499604',
                            type: 'USER',
                            permission: true,
                        },
                    ];
                    const adminperms = [{
                          id: '620196347890499604',
                          type: 'USER',
                          permission: true,
                      }];
                    try {
                    const mod = currentGuild.roles.cache.find(r => r.name.toLowerCase() === 'moderator').id;
                    if (mod) permissions.push({id: mod, type: 'ROLE', permission: true});
                  }  catch(e) {}
                    await currentCommand.permissions.add({ permissions });
                }
                if (adminCommands.includes(currentCommand.name)) {
                    console.log('Refreshed permissions in ' + currentGuild.name + " for " + currentCommand.name);
                    const permissions = [{
                          id: '620196347890499604',
                          type: 'USER',
                          permission: true,
                      }];
                    try {
                    const admin = currentGuild.roles.cache.find(r => r.name.toLowerCase() === 'admin').id
                    if (admin) permissions.push({id: admin, type: 'ROLE', permission: true});
                  }  catch(e) {}
                    await currentCommand.permissions.add({ permissions });
                }
                if (basicdeny.includes(currentCommand.name)) {
                    console.log('Refreshed permissions in ' + currentGuild.name + " for " + currentCommand.name);
                    const permissions = [{
                          id: '620196347890499604',
                          type: 'USER',
                          permission: true,
                      },
                    {
                      id: currentGuild.roles.cache.find(r=> r.name.toLowerCase() === 'basic').id,
                      type: 'ROLE',
                      permission: false,
                    }];
                    await currentCommand.permissions.add({ permissions });
                }
                if (supportercommands.includes(currentCommand.name)) {
                    console.log('Refreshed permissions in ' + currentGuild.name + " for " + currentCommand.name);
                    const permissions = [{
                          id: '620196347890499604',
                          type: 'USER',
                          permission: true,
                      },
                    {
                      id: currentGuild.roles.cache.find(r=> r.name.toLowerCase() === 'supporter').id,
                      type: 'ROLE',
                      permission: true,
                    },
                    {
                      id: currentGuild.roles.cache.find(r=> r.name.toLowerCase() === 'booster').id,
                      type: 'ROLE',
                      permission: true,
                    }];
                    await currentCommand.permissions.add({ permissions });
                }
                if (basicallow.includes(currentCommand.name)) {
                    console.log('Refreshed permissions in ' + currentGuild.name + " for " + currentCommand.name);
                    const permissions = [{
                          id: '620196347890499604',
                          type: 'USER',
                          permission: true,
                      },
                    {
                      id: currentGuild.roles.cache.find(r=> r.name.toLowerCase() === 'basic').id,
                      type: 'ROLE',
                      permission: true,
                    }];
                    await currentCommand.permissions.add({ permissions });
                }
                commandCounter++;
            }
            guildCounter++;
        }
    },

    async refreshCommandPermissionsGlobal(client) {
        for (guild of client.guilds.cache) {
            const currentGuild = await client.guilds.cache.get(guild[0]);
            const commands = await client.application.commands.fetch();
            let commandCounter = 0;
            for (command of commands) {
                let currentCommand = command[1];
                if (commandsToSetPermissions.includes(currentCommand.name)) {
                    console.log('refreshed permissions global in ' + currentGuild.name + " for " + currentCommand.name);
                    const permissions = [
                        /* {
                            id: currentGuild?.roles.everyone.id,
                            type: 'ROLE',
                            permission: false
                        }, */
                      /*  {
                            id: '392767855180906506',
                            type: 'USER',
                            permission: true,
                        },*/
                    ];
                    // console.log(currentGuild.id);
                    // console.log(currentCommand);
                    let id = currentCommand.id;
                    //await client.application?.commands.permissions.add({ currentGuild, currentCommand, permissions });
                    await currentGuild.commands.permissions.add({ command: id, permissions: permissions });
                    //currentCommand.permissions.add({ permissions });
                }
                commandCounter++;
            }
        }
    }
}

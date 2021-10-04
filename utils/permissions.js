const commandsToSetPermissions = ['banslash'];


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
                    console.log('refreshed permissions in ' + currentGuild.name + " for " + currentCommand.name);
                    const permissions = [
                        /* {
                            id: currentGuild?.roles.everyone.id,        //paste here ID of administrator
                            type: 'ROLE',
                            permission: false                           //set whether should be able to use or not
                        }, */
                        {
                            id: '620196347890499604',
                            type: 'USER',
                            permission: true,
                        },
                        {
                            id: '392767855180906506',                   //this is blackcore, can be deleted
                            type: 'USER',
                            permission: true,
                        },
                    ];
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
                        {
                            id: '392767855180906506',
                            type: 'USER',
                            permission: true,
                        },
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
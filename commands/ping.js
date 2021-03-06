const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with bot latency'),
        async execute(interaction) {
        interaction.reply({ content: `Latency is ${Date.now() - interaction.createdTimestamp}ms.` })
    }
};

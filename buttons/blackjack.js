module.exports = {
    data: { name: 'blackjack' },
    async execute(interaction) {
        await interaction.reply('Button clicked!');
    },
};
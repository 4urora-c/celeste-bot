const Discord = require("discord.js");
const { exec } = require("child_process");
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
module.exports = {
  data: new SlashCommandBuilder()
      .setName('restart')
      .setDescription(`Danger: RESTARTS CELESTE`)
      .setDefaultPermission(false),
    async execute(interaction) {
      await interaction.reply('Restarting Celeste. Please wait a moment')
      console.log("This is pid " + process.pid);
      setTimeout(function () {
        process.on("exit", function () {
        require("child_process").spawn(process.argv.shift(), process.argv, {
            cwd: process.cwd(),
            detached : true,
            stdio: "inherit"
        });
    });
    process.exit();
}, 5000);
  }
}


const Discord = require("discord.js");
const giphyToken = "SBchkKbjCTGAueJluuoI00Es2mNxqY0K";
const GphApiClient = require("giphy-js-sdk-core");
const giphy = GphApiClient(giphyToken);
module.exports = {
  name: 'acgif',
  description: 'lookup gif',
  execute: async (client, message) => {
    const msgArr = message.content.split(' ');
    var queries = [
    'animal crossing',
    'tom nook',
    'isabelle animal crossing',
    'animalcrossing',
    'able sisters animal crossing',
    'villager animal crossing',
    'ACNH'
  ]
    var query = queries[Math.round(Math.random() * (queries.length - 1))];
    giphy
      .search("gifs", { q: query })
      .then(response => {
        var totalResponse = response.data.length;
        var responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponse;
        var responseFinal = response.data[responseIndex];
        if (typeof responseFinal.images === "undefined") {
          message.channel.send(`Error! I couldnt find any gifs ${query}`);
          return;
        }
        message.channel.send(
          `Queried \'${query}\' and found:`,
          {
            files: [responseFinal.images.fixed_height.url]
          }
        );
      })
      .catch(err => {
        const gifCrash = new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle("Error")
          .setDescription(`Crash detected!`)
          .addField(
            `Oh No! There was an error looking for a GIF!`,
            `GIF: ${query}`
          )
          .addField("Error Log:", err, true)
          .setTimestamp()
          .setFooter("I\'m a bot using discord.js!");
        message.reply({embeds: [gifCrash]});
        console.log(`Giphy Error: ${err}`);
      });
  },
};

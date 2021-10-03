function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const fetch = require('node-fetch');
const Discord = require("discord.js");
module.exports = {
  name: 'art',
  aliases: 'artwork',
  description: 'name',
  execute: async (client, message) => {
    const adr = 'https://nookipedia.com/wiki/'
    const msgArr = message.content.split(' ');
    if (!msgArr.length) {
      return message.channel.send('You need to supply a search term!');
    }

    const qdata = `${msgArr.slice(1).join('_')}`;
    const response = await fetch(`https://api.nookipedia.com/nh/art/${qdata}`, {
      headers: {
        'X-API-KEY': 'e643a69e-2fff-4b95-b346-c68cb2a80e3a'
      }
    });
    const responsejson = await response.json();
    console.log(responsejson);
    try {
    const { title } = responsejson;
    if (title === 'No data was found for the given query.') {
      return message.channel.send(`No DIY by the name of **${msgArr.slice(1).join(' ')}** was found.`);
    }
    const { name, url, image_url, has_fake, art_name, author, year, art_style, description } = responsejson;
    const embedList = new Discord.MessageEmbed();
    embedList.setTitle(`Here\'s some more information on the artwork ${name}!`);
    embedList.setURL(url);
    embedList.setImage(image_url);
    embedList.addFields(
    { name: 'Name:', value: art_name},
    { name: 'Author:', value: `${author}, ${year}`, inline: true },
    { name: 'Art style:', value: art_style, inline: true },
    { name: 'Description: ', value: description}
  );
    message.channel.send({embeds: [embedList]});
    if (has_fake === true) {
      const { fake_image_url, authenticity } = responsejson;
      const fakeEmbed = new Discord.MessageEmbed();
      fakeEmbed.setTitle(`Here's some information on the fake version of the ${name}!`);
      fakeEmbed.setImage(fake_image_url);
      fakeEmbed.addFields(
        { name: 'Authenticity', value: authenticity }
      );
      message.channel.send({embeds: [fakeEmbed]});
    }
    console.log(`Search for ${name} successful.`);
  } catch(err) {
    message.channel.send(`No artwork by the name of **${msgArr.slice(1).join(' ')}** found.`);
  }
  },
};

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const fetch = require('node-fetch');
const Discord = require("discord.js");
module.exports = {
  name: 'diy',
  aliases: 'recipe',
  description: 'name',
  execute: async (client, message) => {
    const adr = 'https://nookipedia.com/wiki/'
    const msgArr = message.content.split(' ');
    if (!msgArr.length) {
      return message.channel.send('You need to supply a search term!');
    }

    const qdata = `${msgArr.slice(1).join('_')}`;
    const response = await fetch(`https://api.nookipedia.com/nh/recipes/${qdata}`, {
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
    const { name, url, image_url, serial_id, materials, availability } = responsejson;
    const [ availabilitydata ] = availability;
    const { from, note } = availabilitydata;
    const embedList = new Discord.MessageEmbed();
    embedList.setTitle(`Here\'s some more information on the DIY ${name}!`);
    embedList.setURL(url);
    embedList.setImage(image_url);
    embedList.addFields(
    { name: 'Obtained from:', value: from}
  );
    const [ materialdata ] = materials;
    materials.forEach(element => {
      const { name, count } = element;
      embedList.addFields(
        { name: 'Materials required:', value: `${name}: ${count}`, inline: true },
      )
    });
    console.log(`Search for ${name} successful.`);
    message.channel.send({embeds: [embedList]});
  } catch(err) {
    message.channel.send(`No DIY by the name of **${msgArr.slice(1).join(' ')}** found.`);
  }
  },
};

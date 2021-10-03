function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const querystring = require('querystring');
const fetch = require('node-fetch');
const Discord = require("discord.js");
module.exports = {
  name: 'vil',
  aliases: 'villager',
  description: 'name',
  execute: async (client, message) => {
    const adr = 'https://nookipedia.com/wiki/'
    const msgArr = message.content.split(' ');
    if (!msgArr.length) {
      return message.channel.send('You need to supply a search term!');
    }

    const qdata = `?name=${msgArr.slice(1).join('_')}`;

    const response = await fetch(`https://api.nookipedia.com/villagers${qdata}&nhdetails=true`, {
      headers: {
        'X-API-KEY': 'e643a69e-2fff-4b95-b346-c68cb2a80e3a'
      }
    });
    const responsejson = await response.json();
    const [ data ] = responsejson;
    try {
    const { title_color, url, name, image_url, species, personality, gender, birthday_month, birthday_day, sign, quote, phrase, nh_details } = data;
    const { house_interior_url, house_exterior_url, house_wallpaper, house_flooring, house_music } = nh_details;
    const embedList = new Discord.MessageEmbed();
    embedList.setColor(title_color);
    embedList.setTitle(`Here\'s some more information on ${name}!`);
    embedList.setURL(url);
    embedList.setImage(image_url);
    embedList.addFields(
    { name: 'Quote', value: quote},
		{ name: 'Birthday', value: `${birthday_month} ${birthday_day}`, inline: true },
		{ name: 'Sign', value: sign, inline: true },
		{ name: 'Phrase', value: phrase, inline: true },
    { name: 'Gender', value: gender, inline: true },
    { name: 'Personality', value: personality, inline: true },
    { name: 'Species', value: species, inline:true }
  );
    const houseEmbed = new Discord.MessageEmbed();
    houseEmbed.setColor(title_color);
    houseEmbed.setThumbnail(house_exterior_url);
    houseEmbed.setImage(house_interior_url);
    houseEmbed.setTitle(`${name}'s House`);
    houseEmbed.addFields(
      { name: 'Flooring', value: house_flooring, inline: true },
      { name: 'Wallpaper', value: house_wallpaper, inline: true },
      { name: 'Music', value: house_music, inline: true }
    )
    console.log(`Search for ${name} successful.`);
    message.channel.send({embeds: [embedList]});
    message.channel.send({embeds: [houseEmbed]});
  } catch(err) {
    message.channel.send(`No villager by the name of **${msgArr.slice(1).join('')}** found.`);
  }
  },
};

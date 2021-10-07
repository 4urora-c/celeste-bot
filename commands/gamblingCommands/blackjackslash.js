/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */

const { MessageEmbed, MessageActionRow } = require('discord.js');
const config = require('../../config');
const generateCard = require('../../utils/generateCard');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { standButton, hitButton, doubleButton, foldButton } = require('../../utils/buttons');

const getBlackjackValue = (hand) => {
  let value = 0;
  let aces = 0;
  hand.forEach((item) => {
    if (item[1] <= 10) {
      value += item[1];
      if (item[1] === 1) {
        aces += 1;
      }
    } else if (item[1] > 10) {
      value += 10;
    }
  });
  while (aces > 0 && value <= 11) {
    value += 10;
    aces--;
  }
  return value;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjackslash')
    .setDescription('blackjack')
    .addIntegerOption(option =>
      option
        .setName('coins')
        .setDescription('currency amount')
        .setRequired(true)),
  async execute(interaction) {
    const guilddata = await interaction.client.db.islandinfo.findOne({
      guildid: interaction.guild.id,
    });
    const guilddata2 = await interaction.client.db.config.findOne({
      id: interaction.guild.id,
    });
    if (!guilddata2.economy || guilddata2.economy === 'true') {
      let fold = 0;
      let amountChange = 0;
      const userdata = await interaction.client.db.userdata.findOne({ id: interaction.user.id, guildID: interaction.guild.id });
      const amountInput = interaction.options.getInteger('coins');
      if (isNaN(amountInput)) {
        await interaction.reply({ content: 'Enter a valid amount to blackjack', ephemeral: true });
        return;
      }
      let amount = parseInt(amountInput, 10);
      if (isNaN(amount)) {
        await interaction.reply({ content: 'Enter a valid amount to blackjack', ephemeral: true });
        return;
      }
      if (userdata) {
        if (userdata.coins < amount) {
          await interaction.reply({ content: `You only have ${userdata.coins} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}!`, ephemeral: true });
          return;
        } if (amount < 0) {
          await interaction.reply({ content: `Minimum blackjack amount is 0 ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}!`, ephemeral: true });
          return;
        }
        await interaction.client.db.userdata.updateOne({ id: interaction.user.id, guildID: interaction.guild.id }, { $inc: { coins: -amount } }, { upsert: true });

        // BLACK JACK PART
        const playerHand = [];
        const dealerHand = [];

        playerHand.push(generateCard(playerHand));
        playerHand.push(generateCard(playerHand));
        dealerHand.push(generateCard(dealerHand));
        dealerHand.push(generateCard(dealerHand));

        while (getBlackjackValue(dealerHand) < 17) {
          dealerHand.push(generateCard(dealerHand));
        }

        while (getBlackjackValue(playerHand) < 21) {
          const embedMessage = new MessageEmbed()
            .setTitle('Blackjack')
            .setColor('#5b4194')
            .addField('Your hand', `${playerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${getBlackjackValue(playerHand)}**`, true)
            .addField('Dealer hand', `${dealerHand.slice(0, 1).map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${getBlackjackValue(dealerHand.slice(0, 1))}**`, true)
            .addField('Commands', '**stand** to see dealer\'s cards\n**hit** draw another card\n**double** to double down\n**fold** give up but you lose half of your bet')
            .setFooter('You have 90 seconds');
          
            const row = new MessageActionRow().addComponents(standButton, hitButton, doubleButton, foldButton);

            await interaction.reply({ embeds: [embedMessage], components: [row], fetchReply: true }).then(i =>
              setTimeout(() => i.edit({ embeds: [embedMessage.setFooter('Time is over')], components: [] }), 90 * 1000) //update footer after 90 seconds
            );

          const filter = (m) => {
            const isAuthor = m.author.id === interaction.user.id;
            const isCommand = m.content.toLowerCase() === 'stand' || m.content.toLowerCase() === 'hit' || m.content.toLowerCase() === 'double' || m.content.toLowerCase() === 'fold';
            if (isAuthor && isCommand) {
              return true;
            }
            return false;
          };
          const collected = await interaction.channel.awaitMessages(filter, {
            max: 1,
            time: 1000 * 90,
          });
          const response = collected.first();
          if (response.content.toLowerCase() === 'stand') {
            break;
          } else if (response.content.toLowerCase() === 'hit') {
            playerHand.push(generateCard(playerHand));
          } else if (response.content.toLowerCase() === 'double') {
            playerHand.push(generateCard(playerHand));
            amount *= 2;
          } else {
            fold = 1;
            break;
          }
        }
        const playerValue = getBlackjackValue(playerHand);
        const dealerValue = getBlackjackValue(dealerHand);
        if (fold === 1) {
          const embedMessage = new MessageEmbed()
            .setTitle('Blackjack (You Folded)')
            .setColor('#de0000')
            .addField('Your hand', `${playerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`, true)
            .addField('Dealer hand', `${dealerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`, true)
            .addField('Profit', `-${Math.ceil(amount / 2)} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`)
            .addField(`${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`, `${userdata.coins - Math.ceil(amount / 2)} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`);
          interaction.channel.send({ embeds: [embedMessage] });
          amountChange = Math.ceil(amount / 2);
        } else if (playerValue > 21) {
          const embedMessage = new MessageEmbed()
            .setTitle('Blackjack (You Bust)')
            .setColor('#de0000')
            .addField('Your hand', `${playerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`, true)
            .addField('Dealer hand', `${dealerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`, true)
            .addField('Profit', `-${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`)
            .addField(`${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`, `${userdata.coins - amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`);
          interaction.channel.send({ embeds: [embedMessage] });
          amountChange = 0;
        } else if (dealerValue > 21) {
          const embedMessage = new MessageEmbed()
            .setTitle('Blackjack (You Won)')
            .setColor('#88ff88')
            .addField('Your hand', `${playerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`, true)
            .addField('Dealer hand', `${dealerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`, true)
            .addField('Profit', `${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`)
            .addField(`${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`, `${userdata.coins + amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`);
          interaction.channel.send({ embeds: [embedMessage] });
          amountChange = amount * 2;
        } else if (playerValue > dealerValue) {
          const embedMessage = new MessageEmbed()
            .setTitle('Blackjack (You Won)')
            .setColor('#88ff88')
            .addField('Your hand', `${playerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`, true)
            .addField('Dealer hand', `${dealerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`, true)
            .addField('Profit', `${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`)
            .addField(`${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`, `${userdata.coins + amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`);
          interaction.channel.send({ embeds: [embedMessage] });
          amountChange = amount * 2;
        } else if (playerValue === dealerValue) {
          const embedMessage = new MessageEmbed()
            .setTitle('Blackjack (Draw)')
            .setColor('#f5bc42')
            .addField('Your hand', `${playerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`, true)
            .addField('Dealer hand', `${dealerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`, true)
            .addField('Profit', `0 ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`)
            .addField(`${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`, `${userdata.coins} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`);
          interaction.channel.send({ embeds: [embedMessage] });
          amountChange = amount;
        } else {
          const embedMessage = new MessageEmbed()
            .setTitle('Blackjack (You Lost)')
            .setColor('#de0000')
            .addField('Your hand', `${playerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${playerValue}**`, true)
            .addField('Dealer hand', `${dealerHand.map((item) => `${item[1]} ${item[0]}`).join(', ')}\nTotal: **${dealerValue}**`, true)
            .addField('Profit', `-${amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`)
            .addField(`${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`, `${userdata.coins - amount} ${guilddata.currencyname ? guilddata.currencyname : 'Bells'}`);
          interaction.channel.send({ embeds: [embedMessage] });
          amountChange = 0;
        }
        if (amountChange !== 0) { await interaction.client.db.userdata.updateOne({ id: interaction.user.id, guildID: interaction.guild.id }, { $inc: { coins: amountChange } }, { upsert: true }); }
      } else {
        await interaction.reply('You do not have a profile yet!');
      }
    } else {
      await interaction.reply('Economy is disabled on this guild!');
    }
  }
}
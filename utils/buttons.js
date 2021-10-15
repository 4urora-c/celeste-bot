const { MessageButton } = require('discord.js');

let standButton = new MessageButton()
.setCustomId('standButton')
.setLabel('STAND')
.setStyle('SUCCESS');

let hitButton = new MessageButton()
.setCustomId('hitButton')
.setLabel('HIT')
.setStyle('PRIMARY');

let doubleButton = new MessageButton()
.setCustomId('doubleButton')
.setLabel('DOUBLE')
.setStyle('PRIMARY');

let foldButton = new MessageButton()
.setCustomId('foldButton')
.setLabel('FOLD')
.setStyle('DANGER');

module.exports = { standButton, hitButton, doubleButton, foldButton };
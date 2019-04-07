const Utils = require('../utils');
const Constants = require('../models/constants');
const utip = require('../models/utip');

const commands = {
  channel: {
    help: ['Permet de changer les messages utip seront affiché.'],
    args: '[#channel]',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, `**channel: **: <#${utip.channel}>`);
        return;
      }
      if (!message.mentions.channels && !message.mentions.channels.first()) {
        Utils.reply(message, 'il faut mentioner un channel.', true);
        return;
      }
      utip.channel = message.mentions.channels.first().id;
      Utils.reply(message, "Le channel d'anonces à bien été modifié.");
    }
  },
  cooldown: {
    help: ['Permet de changer le cooldown des messages utip.'],
    args: '[cooldown]',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, `**cooldown: **: ${utip.cooldown}`);
        return;
      }
      const nb = Number(args[0]);
      if (Number.isNaN(nb) || nb <= 0) {
        Utils.reply(message, 'Le cooldown doit être un entier positif.', true);
        return;
      }
      utip.cooldown = nb;
      Utils.reply(message, 'Le cooldown a bien été modifié.');
    }
  }
};
const help = message => {
  const keys = Object.keys(commands);
  const fields = [];
  keys.forEach(command => {
    fields.push({
      text: commands[command].help,
      title: `${Constants.prefix}utip ${command} ${commands[command].args}`,
      grid: false
    });
  });
  Utils.sendEmbed(message, 0x00afff, 'Liste des commandes utip', '', message.author, fields);
};

module.exports = {
  role: 'MANAGE_GUILD',
  helpCat: 'Permet de changer les configurations des messages utip',
  help,
  runCommand: (args, message) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      Utils.reply(
        message,
        "Vous n'avez pas les permissions pour changer les paramètres utip",
        true
      );
      return;
    }
    if (commands[args[0]]) {
      const label = args[0];
      args.shift();
      commands[label].runCommand(args, message);
    } else {
      help(message);
    }
  }
};

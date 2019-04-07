const Utils = require('../utils');
const constants = require('../models/constants');

const commands = {
  prefix: {
    help: [
      'Permet de changer le préfix des commandes du bot.',
    ],
    args: '[prefix]',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, `**Préfix**: ${constants.prefix}`);
        return;
      }
      constants.prefix = args.join(' ');
      Utils.reply(message, 'Le préfix a bien été modifié.');
    },
  },
  logChannel: {
    help: [
      'le channel ou seront log les commandes.',
    ],
    args: '[#channel]',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, `**channel: **: <#${constants.logChannel }>`);
        return;
      }
      if (!message.mentions.channels && !message.mentions.channels.first()) {
        Utils.reply(message, 'il faut mentioner un channel.', true);
        return;
      }
      constants.logChannel = message.mentions.channels.first().id;
      Utils.reply(message, 'Le channel de log à bien été modifié.');
    },
  },
  welcome: {
    help: [
      'Permet de changer le message de bienvenue.',
    ],
    args: '[message]',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, `**Message de bienvenue**: ${constants.welcomeMessage}`);
        return;
      }
      constants.welcomeMessage = args.join(' ');
      Utils.reply(message, 'Le message de bienvenue a bien été modifié.');
    },
  },
};

const help = (message) => {
  const keys = Object.keys(commands);
  const fields = [];
  keys.forEach((command) => {
    fields.push({
      text: commands[command].help,
      title: `${constants.prefix}config ${command} ${commands[command].args}`,
      grid: false,
    });
  });
  Utils.sendEmbed(message, 0x00AFFF, 'Liste des commandes de config', '', message.author, fields);
};

module.exports = {
  role: 'MANAGE_GUILD',
  helpCat: 'Permet de changer les configurations de base du bot',
  help,
  runCommand: (args, message) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      Utils.reply(message, "Vous n'avez pas les permissions pour changer les config", true);
      return;
    }
    if (commands[args[0]]) {
      const label = args[0];
      args.shift();
      commands[label].runCommand(args, message);
    } else {
      help(message);
    }
  },
};

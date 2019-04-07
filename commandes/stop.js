const Utils = require('../utils');
const Constants = require('../models/constants');

module.exports = {
  role: 'SEND_MESSAGES',
  helpCat: "Permet d'arrêter le bot",
  help(message) {
    Utils.sendEmbed(message, 0x00afff, 'Utilisation de la commande stop', '', message.author, [
      {
        title: `${Constants.prefix} stop`,
        text: "Permet d'arrêter le bot",
        grid: false
      }
    ]);
  },
  runCommand: (args, message) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      Utils.reply(message, "Vous n'avez pas les permissions pour arrêter le bot", true);
      return;
    }
    Utils.reply(message, 'Arrêt du bot...');
    process.exit(84);
  }
};

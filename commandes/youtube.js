const Utils = require('../utils');
const youtube = require('../models/youtube');
const Constants = require('../models/constants');

const commands = {
  interval: {
    help: ["Permet de changer l'interval d'abonné à afficher."],
    args: '[nombre]',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, `**Interval**: ${youtube.interval}`);
        return;
      }
      const interval = Number(args[0]);
      if (Number.isNaN(interval) || interval < 0) {
        Utils.reply(message, "L'interval dois être un nombre plus grand que 0.", true);
      }
      youtube.interval = interval;
      Utils.reply(message, "L'interval a bien été modifié.");
    }
  },
  channel: {
    help: ["Permet de changer le message ou le nombre d'abonné sera affiché."],
    args: '[#channel]',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, `**channel: **: <#${youtube.channel}>`);
        return;
      }
      if (!message.mentions.channels && !message.mentions.channels.first()) {
        Utils.reply(message, 'il faut mentioner un channel.', true);
        return;
      }
      youtube.channel = message.mentions.channels.first().id;
      Utils.reply(message, "Le channel d'anonces à bien été modifié.");
    }
  },
  messages: {
    help: ['Permet de lister les messages.'],
    args: '',
    runCommand: (args, message) => {
      const { messages } = youtube;
      if (messages || messages.length === 0) {
        Utils.reply(message, 'Pas de messages configuré.');
        return;
      }
      const fields = [];
      for (let i = 0; i < messages.length; i += 1) {
        fields.push({
          title: `Message numéro: ${i + 1}`,
          text: messages[i],
          grid: false
        });
      }
      Utils.sendEmbed(
        message,
        0xe8c408,
        'Liste des messges:',
        '',
        message.author,
        fields,
        null,
        10
      );
    }
  },
  test: {
    help: ['Permet de tester les messages.'],
    args: '<index>',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, "Veuillez renseigner l'index du message à supprimé.", true);
        return;
      }
      const index = Number(args[0]);
      if (Number.isNaN(index) || index - 1 < 0 || index > youtube.messages.length) {
        Utils.reply(
          message,
          `L'index doit être compris entre 1 et ${youtube.messages.length} .`,
          true
        );
        return;
      }
      const oldcap = youtube.getNextCap(youtube.lastNbSubscribers);
      const cap = youtube.getNextCap(youtube.lastNbSubscribers);
      let ytMessage = youtube.messages[index - 1];
      ytMessage = ytMessage.replace(
        new RegExp('%total%', 'g'),
        Utils.spacer(youtube.lastNbSubscribers)
      );
      ytMessage = ytMessage.replace(new RegExp('%cap%', 'g'), Utils.spacer(cap));
      ytMessage = ytMessage.replace(new RegExp('%oldcap%', 'g'), Utils.spacer(oldcap));
      ytMessage = ytMessage.replace(
        new RegExp('%cap-total%', 'g'),
        Utils.spacer(cap - youtube.lastNbSubscribers)
      );
      message.channel.send(ytMessage);
    }
  },
  addmessage: {
    help: [
      "Permet d'ajouter un message dans la liste",
      "**%total%** pour le nombre total d'abonnés",
      "**%cap%** pour le prochain cap d'abonné à avoir",
      "**%cap-total%** pour le nombre total d'abonnés soustrais tu cap"
    ],
    args: '<message>',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, 'Veuillez mettre un message à ajouter.', true);
        return;
      }
      youtube.addMessage(args.join(' '));
      Utils.reply(message, 'Le message à bien été ajouté.');
    }
  },
  delmessage: {
    help: ['Permet de supprimer un message dans la liste'],
    args: '<index>',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, "Veuillez renseigner l'index du message à supprimé.", true);
        return;
      }
      const index = Number(args[0]);
      if (Number.isNaN(index) || index - 1 < 0 || index > youtube.messages.length) {
        Utils.reply(
          message,
          `L'index doit être compris entre 1 et ${youtube.messages.length} .`,
          true
        );
        return;
      }
      youtube.delMessage(index - 1);
      Utils.reply(message, 'Le message à bien été supprimé.');
    }
  },
  capmessages: {
    help: ['Permet de lister les messages de passage de caps.'],
    args: '',
    runCommand: (args, message) => {
      const messages = youtube.capmessages;
      if (messages.length === 0) {
        Utils.reply(message, 'Pas de messages configuré.');
        return;
      }
      const fields = [];
      for (let i = 0; i < messages.length; i += 1) {
        fields.push({
          title: `Message numéro: ${i + 1}`,
          text: messages[i],
          grid: false
        });
      }
      Utils.sendEmbed(
        message,
        0xe8c408,
        'Liste des messages de passage de cap:',
        '',
        message.author,
        fields,
        null,
        10
      );
    }
  },
  testcap: {
    help: ['Permet de tester les capmessages.'],
    args: '<index>',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, "Veuillez renseigner l'index du message à supprimé.", true);
        return;
      }
      const index = Number(args[0]);
      if (Number.isNaN(index) || index - 1 < 0 || index > youtube.capmessages.length) {
        Utils.reply(
          message,
          `L'index doit être compris entre 1 et ${youtube.capmessages.length} .`,
          true
        );
        return;
      }
      const oldcap = youtube.getNextCap(youtube.lastNbSubscribers);
      const cap = youtube.getNextCap(youtube.lastNbSubscribers);
      let ytMessage = youtube.capmessages[index - 1];
      ytMessage = ytMessage.replace(
        new RegExp('%total%', 'g'),
        Utils.spacer(youtube.lastNbSubscribers)
      );
      ytMessage = ytMessage.replace(new RegExp('%cap%', 'g'), Utils.spacer(cap));
      ytMessage = ytMessage.replace(new RegExp('%oldcap%', 'g'), Utils.spacer(oldcap));
      ytMessage = ytMessage.replace(
        new RegExp('%cap-total%', 'g'),
        Utils.spacer(cap - youtube.lastNbSubscribers)
      );
      message.channel.send(ytMessage);
    }
  },
  addcapmessage: {
    help: [
      "Permet d'ajouter un message de passage de cap dans la liste",
      "**%total%** pour le nombre total d'abonnés",
      "**%cap%** pour le prochain cap d'abonné à avoir",
      "**%cap-total%** pour le nombre total d'abonnés soustrais tu cap",
      "**%oldcap%** pour le précédent cap d'abonné obtenu"
    ],
    args: '<message>',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, 'Veuillez mettre un message à ajouter.', true);
        return;
      }
      youtube.addCapMessage(args.join(' '));
      Utils.reply(message, 'Le message à bien été ajouté.');
    }
  },
  delcapmessage: {
    help: ['Permet de supprimer un message de passage de cap dans la liste'],
    args: '<index>',
    runCommand: (args, message) => {
      if (args.length === 0) {
        Utils.reply(message, "Veuillez renseigner l'index du message à supprimé.", true);
        return;
      }
      const index = Number(args[0]);
      if (Number.isNaN(index) || index - 1 < 0 || index > youtube.capmessages.length) {
        Utils.reply(
          message,
          `L'index doit être compris entre 1 et ${youtube.capmessages.length} .`,
          true
        );
        return;
      }
      youtube.delCapMessage(index - 1);
      Utils.reply(message, 'Le message à bien été supprimé.');
    }
  }
};

const help = message => {
  const keys = Object.keys(commands);
  const fields = [];
  keys.forEach(command => {
    fields.push({
      text: commands[command].help,
      title: `${Constants.prefix}youtube ${command} ${commands[command].args}`,
      grid: false
    });
  });
  Utils.sendEmbed(message, 0x00afff, 'Liste des commandes youtube', '', message.author, fields);
};

module.exports = {
  role: 'MANAGE_GUILD',
  helpCat: 'Permet de changer les configurations des messages youtube',
  help,
  runCommand: (args, message) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      Utils.reply(
        message,
        "Vous n'avez pas les permissions pour changer les paramètres youtube",
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

const Discord = require('discord.js');

const bot = new Discord.Client();
const moment = require('moment');
const Utils = require('./utils');
const token = require('./token');
const utipRequest = require('./intervals/utip');
const youtubeRequest = require('./intervals/youtube');

let guild = null;

const globalConst = require('./models/constants');
const youtube = require('./models/youtube');
const utip = require('./models/utip');
const roleAction = require('./models/roleAction');

globalConst.init();
youtube.init();
utip.init();

const roleActionManager = require('./manager/roleAction');

roleAction.init();

Utils.setConfig(globalConst);
const configCommands = require('./commandes/config');
const youtubeCommands = require('./commandes/youtube');
const utipCommands = require('./commandes/utip');
const reloadCommands = require('./commandes/reload');
const stopCommands = require('./commandes/stop');
const updateCommands = require('./commandes/update');
const roleActionCommands = require('./commandes/roleAction');

const commands = {
  config: configCommands,
  youtube: youtubeCommands,
  utip: utipCommands,
  reload: reloadCommands,
  stop: stopCommands,
  update: updateCommands,
  roleaction: roleActionCommands
};
try {
  bot.on('ready', () => {
    Utils.log(`${Utils.Color.FgGreen}bot started`);
    bot.user.setActivity('je suis un bot');
  });
} catch (e) {
  Utils.log(e.stack, true);
}

const runCommand = (args, message) => {
  const cmdArgs = [...args];
  if (cmdArgs[0] === `${globalConst.prefix}help`) {
    Utils.log(`running ${Utils.Color.FgYellow}help ${Utils.Color.Reset}command`);
    if (cmdArgs.length > 1) {
      if (commands[cmdArgs[1]] && message.member.hasPermission(commands[cmdArgs[1]].role)) {
        commands[cmdArgs[1]].help(message);
        return;
      }
      Utils.reply(message, `Aucune commande du nom de **${cmdArgs[1]}**.`, true);
      return;
    }
    const keys = Object.keys(commands);
    const fields = [];
    keys.forEach(command => {
      if (message.member.hasPermission(commands[command].role)) {
        fields.push({
          text: commands[command].helpCat,
          title: command,
          grid: false
        });
      }
    });
    Utils.sendEmbed(
      message,
      0x00afff,
      'Liste des commandes',
      `Pour plus d'info sur une commandes faites **${globalConst.prefix}help [commande]**`,
      message.author,
      fields
    );
    return;
  }
  cmdArgs[0] = cmdArgs[0].replace(globalConst.prefix, '');
  if (commands[cmdArgs[0]]) {
    const label = cmdArgs[0];
    Utils.log(`running ${Utils.Color.FgYellow}${label} ${Utils.Color.Reset}command`);
    cmdArgs.shift();
    commands[label].runCommand(cmdArgs, message);
  }
};

bot.on('message', message => {
  try {
    if (message.author.bot || message.channel.type === 'dm') {
      return;
    }
    if (message.content.substring(0, globalConst.prefix.length) === globalConst.prefix) {
      const args = message.content.split(' ');
      Utils.log(
        'Command detected',
        false,
        message.channel.name,
        message.author.username,
        message.content
      );
      Utils.log(
        `fetching for ${Utils.Color.FgYellow}${message.author.username}${Utils.Color.Reset}`
      );
      message.channel.guild
        .fetchMember(message.author.id)
        .then(member => {
          runCommand(args, {
            ...message,
            member
          });
        })
        .catch(e => {
          Utils.log(e.stack, true);
        });
    } else if (
      new RegExp(`((utip).*(<@[!]*${bot.user.id}>))|((<@[!]*${bot.user.id}>).*(utip))`, 'gi').test(
        message.content
      )
    ) {
      const percent = Math.floor((100 * utip.found) / utip.goal);
      Utils.log(
        'Magik command utip detected',
        false,
        message.channel.name,
        message.author.username,
        message.content
      );
      if (!utip.cooldown) {
        Utils.sendUtipMessage(utip, percent, message.channel.id);
        return;
      }
      if (!utip.lastUsed) {
        Utils.sendUtipMessage(utip, percent, message.channel.id);
        utip.lastUsed = moment();
        return;
      }
      const diff = moment(utip.lastUsed)
        .add(utip.cooldown, 'seconds')
        .diff(moment());
      if (diff <= 0) {
        Utils.sendUtipMessage(utip, percent, message.channel.id);
        utip.lastUsed = moment();
        return;
      }
    }
  } catch (e) {
    Utils.log(e.stack, true);
  }
});

try {
  const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
  };

  // This is because message reaction dont work with old message :/ thanks discord
  bot.on('raw', event => {
    if (events[event.t]) return;

    const { d: data } = event;
    const user = bot.users.get(data.user_id);
    const channel = bot.channels.get(data.channel_id);
    if (!channel) {
      return;
    }

    channel
      .fetchMessage(data.message_id)
      .then(message => {
        bot.emit(`custom${events[event.t]}`, { emoji: data.emoji, message }, user);
      })
      .catch(err => {
        Utils.log(err.stack, true);
      });
  });
} catch (e) {
  Utils.log(e.stack, true);
}

try {
  bot
    .login(token)
    .then(() => {
      guild = bot.guilds.first();
      Utils.setGuild(guild);
      roleActionManager.init(roleAction.roleActions, bot);
    })
    .catch(e => {
      Utils.log(e.stack, true);
    });
  bot.on('error', err => {
    Utils.log(err.stack, true);
  });
} catch (err) {
  Utils.log(err.stack, true);
}

try {
  setInterval(() => {
    youtubeRequest(guild);
  }, 1000);
} catch (err) {
  Utils.log(err.stack, true);
}
try {
  setInterval(() => {
    utipRequest(guild);
  }, 5000);
} catch (err) {
  Utils.log(err.stack, true);
}

let isYoutube = false;

setInterval(() => {
  if (isYoutube) {
    bot.user.setActivity(`${Utils.spacer(Number(utip.found))}€ sur uTip ce mois-ci`);
  } else {
    bot.user.setActivity(`${Utils.spacer(Number(youtube.lastNbSubscribers))} abonnés youtube`);
  }
  isYoutube = !isYoutube;
}, 15 * 1000);

// message de bienvenue
try {
  bot.on('guildMemberAdd', member => {
    if (globalConst.welcomeMessage) {
      Utils.sendDM(member.user, globalConst.welcomeMessage);
    } else {
      Utils.log('Pas de message de bienvenue configuré', true);
    }
  });
} catch (err) {
  Utils.log(err.stack, true);
}

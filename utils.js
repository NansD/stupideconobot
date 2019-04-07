const Discord = require('discord.js');
const moment = require('moment');

const Color = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m'
};
const ReactMap = {
  0: 'one',
  1: 'two',
  2: 'three',
  3: 'four',
  4: 'five',
  5: 'six',
  6: 'seven',
  7: 'eight',
  8: 'nine',
  9: 'keycap_ten',
  10: 'regional_indicator_a',
  11: 'regional_indicator_b',
  12: 'regional_indicator_c',
  13: 'regional_indicator_d',
  14: 'regional_indicator_e',
  15: 'regional_indicator_f',
  16: 'regional_indicator_g',
  17: 'regional_indicator_h',
  18: 'regional_indicator_i',
  19: 'regional_indicator_j',
  20: 'regional_indicator_k',
  21: 'regional_indicator_l',
  22: 'regional_indicator_m',
  23: 'regional_indicator_n',
  24: 'regional_indicator_o',
  25: 'regional_indicator_p'
};
const ConfirmReact = 'white_check_mark';

const UnicodeReactMap = {
  0: `1⃣`,
  1: `2⃣`,
  2: `3⃣`,
  3: `4⃣`,
  4: `5⃣`,
  5: `6⃣`,
  6: `7⃣`,
  7: `8⃣`,
  8: `9⃣`,
  9: `🔟`,
  10: `🇦`,
  11: `🇧`,
  12: `🇨`,
  13: `🇩`,
  14: `🇪`,
  15: `🇫`,
  16: `🇬`,
  17: `🇭`,
  18: `🇮`,
  19: `🇯`,
  20: `🇰`,
  21: `🇱`,
  22: `🇲`,
  23: `🇳`,
  24: `🇴`,
  25: `🇵`
};
const UnicodeConfirmReact = '✅';
const UnicodeCancelReact = '❌';
let config = null;
let Utilsguild = null;

const sendEmbedInChannel = (
  channel,
  color,
  title,
  content,
  author,
  fields,
  image = null,
  maxField = 25
) => {
  let embed;
  if (fields.length === 0) {
    embed = new Discord.RichEmbed({});
    embed.setColor(color);
    embed.setTitle(title);
    embed.setDescription(content);
    if (image) {
      embed.setThumbnail(image);
    }
    if (author) {
      embed.setFooter(`${author.username}#${author.discriminator}`, author.avatarURL);
    }
    return channel.send('', embed);
  }
  for (let i = 0; i < fields.length; i += 1) {
    if (i % maxField === 0) {
      if (embed) {
        channel.send('', embed);
        embed = null;
      }
      embed = new Discord.RichEmbed({});
      embed.setColor(color);
      embed.setTitle(title);
      embed.setDescription(content);
      if (image) {
        embed.setThumbnail(image);
      }
      if (author) {
        embed.setFooter(`${author.username}#${author.discriminator}`, author.avatarURL);
      }
    }
    embed.addField(fields[i].title, fields[i].text, fields[i].grid);
  }
  return channel.send('', embed);
};
const recurciveReactNbTime = (message, nb, current, withConfirm = false, withCancel = false) => {
  message.react(UnicodeReactMap[current]).then(() => {
    if (current + 1 !== nb) {
      recurciveReactNbTime(message, nb, current + 1, withConfirm, withCancel);
      return;
    }
    if (withConfirm) {
      message.react(UnicodeConfirmReact).then(() => {
        if (withCancel) {
          message.react(UnicodeCancelReact);
        }
      });
      return;
    }
    if (withCancel) {
      message.react(UnicodeCancelReact);
    }
  });
};
module.exports = {
  reply(message, toSend, error) {
    const embed = new Discord.RichEmbed({});
    embed.setColor(error ? 0xa80000 : 0x00afff);
    embed.setDescription(toSend);
    embed.setFooter(
      `${message.author.username}#${message.author.discriminator}`,
      message.author.avatarURL
    );
    return message.channel.send('', embed);
  },
  sendDM(user, toSend, error) {
    const embed = new Discord.RichEmbed({});
    embed.setColor(error ? 0xa80000 : 0x00afff);
    embed.setDescription(toSend);
    embed.setFooter(`${user.username}#${user.discriminator}`, user.avatarURL);
    return user.send('', embed);
  },
  getHighestRole(roles) {
    let highestRole;
    roles.every(role => {
      if (!highestRole || highestRole.comparePositionTo(role) > 0) {
        highestRole = role;
      }
      return highestRole;
    });
    return highestRole;
  },
  canExecuteOn(author, user) {
    // can users of the same role execute anything on users of the *same* role ?
    return (
      this.getHighestRole(author.roles).comparePositionTo(this.getHighestRole(user.roles)) >= 0
    );
  },
  sendEmbed(message, color, title, content, author, fields, image = null, maxField) {
    return sendEmbedInChannel(
      message.channel,
      color,
      title,
      content,
      author,
      fields,
      image,
      maxField
    );
  },
  sendDmEmbed(user, color, title, content, author, fields, image = null, maxField) {
    return sendEmbedInChannel(user, color, title, content, author, fields, image, maxField);
  },
  sendEmbedInChannel,
  replaceModifier(
    input,
    clan,
    guildMember,
    player,
    rank,
    isPS4,
    ps4text,
    withHightLight = true,
    withoutPlayer = false,
    playerNickname = null
  ) {
    let receivedMessage = input;
    let playerName = `<@!${guildMember.id}>`;
    let clanName = clan ? guildMember.guild.roles.get(clan.id).name : null;
    if (!withHightLight) {
      if (!playerNickname) {
        playerName = '%player%';
      } else {
        playerName = playerNickname;
      }
      clanName = clan ? guildMember.guild.roles.get(clan.id).name : null;
    }
    if (!withoutPlayer) {
      receivedMessage = receivedMessage.replace(/%player%/gi, playerName);
    }
    let replaceSomething = false;
    if (player) {
      receivedMessage = receivedMessage.replace(
        /%rank%/gi,
        player.activeRank ? player.activeRank.displayName : ''
      );
      replaceSomething = !!player.activeRank;
    } else {
      receivedMessage = receivedMessage.replace(/%rank%/gi, '');
    }
    if (rank && rank.smiley) {
      receivedMessage = receivedMessage.replace(/%srank%/gi, rank.smiley);
      replaceSomething = true;
    } else {
      receivedMessage = receivedMessage.replace(/%srank%/gi, '');
    }
    if (clanName) {
      receivedMessage = receivedMessage.replace(/%clan%/gi, clanName);
    } else {
      receivedMessage = receivedMessage.replace(/%clan%/gi, '');
    }
    if (clan && clan.smiley) {
      receivedMessage = receivedMessage.replace(/%sclan%/gi, clan.smiley);
    } else {
      receivedMessage = receivedMessage.replace(/%sclan%/gi, '');
    }

    receivedMessage = receivedMessage.replace(/%PS4%/gi, isPS4 ? ps4text : '');
    if (!withHightLight && !replaceSomething) {
      return isPS4 ? `${playerName} ${ps4text}` : playerName;
    }
    return receivedMessage;
  },
  getUsernameRegex(patern) {
    const restrictedChar = ['\\', '^', '$', '(', ')', '|', '+', '.', '*', '[', ']', '-', '?', '/'];
    let result = '';
    const paternArr = patern.split('%player%');
    for (let i = 0; i < paternArr[0].length; i += 1) {
      let char = paternArr[0].charAt(i);
      if (restrictedChar.indexOf(char) > -1) {
        char = `\\${char}`;
      }
      char = `(?:${char}|$)`;
      result += char;
    }
    result += '(.+)';
    if (paternArr[1]) {
      for (let i = 0; i < paternArr[1].length; i += 1) {
        let char = paternArr[1].charAt(i);
        if (restrictedChar.indexOf(char) > -1) {
          char = `\\${char}`;
        }
        if (i >= 3) {
          char = `(?:${char}|$)`;
        }
        result += char;
      }
    }
    return result;
  },
  getRolesOfPerm(guild, permissions) {
    const { roles } = guild;
    const rolesKey = roles.keyArray();
    const rolesWithPerm = [];
    for (let i = 0; i < rolesKey.length; i += 1) {
      if (roles.get(rolesKey[i]).hasPermission(permissions) && !roles.get(rolesKey[i]).managed) {
        rolesWithPerm.push(roles.get(rolesKey[i]));
      }
    }
    return rolesWithPerm;
  },
  log(text, err = false, place = null, by = null, content = null) {
    let toWrite = `${Color.FgCyan}[${moment().format('DD-MM-YYYY HH:mm:ss')}]:${Color.Reset}`;
    const fields = [
      {
        title: 'Date:',
        text: moment().format('DD-MM-YYYY HH:mm:ss'),
        grid: true
      }
    ];
    if (err) {
      toWrite += Color.BgRed;
    }
    toWrite += ` ${text} ${Color.Reset}`;
    if (!err) {
      fields.push({
        title: 'Type:',
        // eslint-disable-next-line no-control-regex
        text: text.replace(/\x1b\[[0-9]*m/im, ''),
        grid: true
      });
    }
    if (place) {
      toWrite += ` in ${Color.FgYellow}${place}${Color.Reset}`;
      fields.push({
        title: 'Dans:',
        text: place,
        grid: true
      });
    }
    if (by) {
      toWrite += ` by ${Color.FgGreen}${by}${Color.Reset}`;
      fields.push({
        title: 'Auteur:',
        text: by,
        grid: true
      });
    }
    if (content) {
      toWrite += `: ${Color.FgCyan}${content}${Color.Reset}`;
      fields.push({
        title: 'Contenu:',
        text: content,
        grid: true
      });
    }
    if (config && config.logChannel && Utilsguild && (by || err)) {
      let errorText = '';
      if (text) {
        // eslint-disable-next-line no-control-regex
        errorText = text.replace(/\x1b\[[0-9]*m/im, '');
      } else {
        errorText = 'ERREUR NULL';
      }
      sendEmbedInChannel(
        Utilsguild.channels.get(config.logChannel),
        err ? 0xa80000 : 0x00afff,
        err ? 'Erreur' : 'Log',
        err ? errorText : '',
        null,
        fields
      );
    }
    console.log(toWrite);
    if (err) {
      console.log(console.trace());
    }
  },
  // What is its purpose ?
  reactNbTime(message, nb, withConfirm = false, withCancel = false) {
    recurciveReactNbTime(message, nb, 0, withConfirm, withCancel);
  },
  Color,
  ReactMap,
  ConfirmReact,
  UnicodeReactMap,
  UnicodeConfirmReact,
  UnicodeCancelReact,
  InvertedUnicodeReactMap() {
    const invertedUnicodeReactMap = {};
    Object.keys(UnicodeConfirmReact).forEach(key => {
      invertedUnicodeReactMap[UnicodeConfirmReact[key]] = key;
    });
    return invertedUnicodeReactMap;
  },
  removeMyReact(message) {
    message.reactions.forEach(reaction => {
      reaction.remove();
    });
  },
  setConfig(conf) {
    config = conf;
  },
  setGuild(g) {
    Utilsguild = g;
  },
  get guild() {
    return Utilsguild;
  },
  config,
  spacer(nb) {
    return nb.toLocaleString('fr-FR').replace(/,/g, ' ');
  },
  sendUtipMessage(utip, percent, channel) {
    const found = utip.found.toLocaleString('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: '2'
    });
    const goal = Math.round(utip.goal);
    sendEmbedInChannel(
      Utilsguild.channels.get(channel),
      0x00afff,
      'Utip Stupid Economics',
      `Le uTip est à **${percent}%** de son objectif ( ${found}€/${goal}€ ).
Soutenez-nous nous avec uTip: ${utip.url}`,
      null,
      []
    );
  }
};

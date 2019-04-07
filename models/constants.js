const fs = require('fs');
const Utils = require('../utils');

let constants = {
  prefix: '_',
  logChannel: null,
  welcomeMessage: 'Bienvenue !'
};

// TODO: use async / await
const save = () => {
  fs.writeFile(`${__dirname}/../data/constants.json`, JSON.stringify(constants), err => {
    return Utils.log(err, true);
  }).then(() =>
    Utils.log(`The ${Utils.Color.FgYellow}constants${Utils.Color.Reset} file was saved!`)
  );
};

// TODO: refactor to :
// const load = async() => {...}
const load = () => {
  return new Promise(resolve => {
    fs.readFile(`${__dirname}/../data/constants.json`, (err, data) => {
      if (err) return;
      constants = JSON.parse(data);
      resolve(constants);
    });
  });
};

module.exports = {
  init() {
    return new Promise((resolve, reject) => {
      load()
        .then(r => resolve(r))
        .catch(e => reject(e));
    });
  },
  get prefix() {
    return constants.prefix;
  },
  get logChannel() {
    return constants.logChannel;
  },
  get welcomeMessage() {
    return constants.welcomeMessage;
  },
  set prefix(prefix) {
    constants.prefix = prefix;
    save();
    return constants.prefix;
  },
  set logChannel(logChannel) {
    constants.logChannel = logChannel;
    save();
    return constants.logChannel;
  },
  set welcomeMessage(welcomeMessage) {
    constants.welcomeMessage = welcomeMessage;
    save();
    return constants.welcomeMessage;
  }
};

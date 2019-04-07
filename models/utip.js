const fs = require('fs');
const Utils = require('../utils');

// TODO: make a class out of it
let utip = {
  found: 0,
  goal: 0,
  url: 'https://www.utip.io/stupideconomics',
  percent: 0,
  channel: null,
  cooldown: null,
  lastUsed: null
};

const save = () => {
  fs.writeFile(`${__dirname}/../data/utip.json`, JSON.stringify(utip), err => {
    return Utils.log(err, true);
  });
};

function load() {
  return new Promise(resolve => {
    fs.readFile(`${__dirname}/../data/utip.json`, (err, data) => {
      if (err) return;
      utip = JSON.parse(data);
      resolve(utip);
    });
  });
}
module.exports = {
  init() {
    return new Promise((resolve, reject) => {
      load()
        .then(r => resolve(r))
        .catch(e => reject(e));
    });
  },
  get found() {
    return utip.found;
  },
  get goal() {
    return utip.goal;
  },
  get url() {
    return utip.url;
  },
  get percent() {
    return utip.percent;
  },
  get channel() {
    return utip.channel;
  },
  get cooldown() {
    return utip.cooldown;
  },
  get lastUsed() {
    return utip.lastUsed;
  },
  set found(found) {
    utip.found = found;
    save();
    return utip.found;
  },
  set goal(goal) {
    utip.goal = goal;
    save();
    return utip.goal;
  },
  set url(url) {
    utip.url = url;
    save();
    return utip.url;
  },
  set percent(percent) {
    utip.percent = percent;
    save();
    return utip.percent;
  },
  set channel(channel) {
    utip.channel = channel;
    save();
    return utip.channel;
  },
  set cooldown(cooldown) {
    utip.cooldown = cooldown;
    save();
    return utip.cooldown;
  },
  set lastUsed(lastUsed) {
    utip.lastUsed = lastUsed;
    save();
    return utip.lastUsed;
  }
};

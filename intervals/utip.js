const request = require('request');
const utip = require('../models/utip');
const Utils = require('../utils');

const utipRequest = () => {
  if (!utip.url) {
    return;
  }
  request(
    {
      url: utip.url
    },
    (error, response, body) => {
      if (!body) {
        return;
      }
      try {
        let firstSplit = body.split('amountEarned&quot;&#x3A;');
        if (!firstSplit || firstSplit.length < 1) {
          return;
        }
        let secondSplit = firstSplit[1].split(',&quot;amountCounter');
        if (!secondSplit || secondSplit.length < 1) {
          return;
        }
        const found = Number(secondSplit[0]);

        firstSplit = body.split('goalAmount&quot;&#x3A;');
        if (!firstSplit || firstSplit.length < 1) {
          return;
        }
        secondSplit = firstSplit[1].split(',&quot;goalString');
        if (!secondSplit || secondSplit.length < 1) {
          return;
        }
        const goal = Number(secondSplit[0]);
        if (Number.isNaN(found)) {
          return;
        }
        if (Number.isNaN(goal)) {
          return;
        }
        if (found !== utip.found) {
          utip.found = found;
        }
        if (goal !== utip.goal) {
          utip.goal = goal;
        }
        const percent = Math.floor((100 * utip.found) / utip.goal);
        if (percent !== utip.percent) {
          utip.percent = percent;

          if (utip.channel && percent % 10 === 0) {
            Utils.sendUtipMessage(utip, percent, utip.channel);
          }
        }
      } catch (e) {
        Utils.log(`erreur de parse utip:${e}`, true);
      }
    }
  );
};
module.exports = utipRequest;

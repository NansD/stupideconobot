const request = require('request');
const youtubeApiKey = require('../youtubeApiKey');
const youtube = require('../models/youtube');
const Utils = require('../utils');

const channelYoutubeId = 'UCyJDHgrsUKuWLe05GvC2lng';

const youtubeRequest = guild => {
  request(
    {
      url: `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelYoutubeId}&key=${youtubeApiKey}`
    },
    (error, response, body) => {
      let nb = 0;
      try {
        const result = JSON.parse(body);
        nb = result.items[0].statistics.subscriberCount;
      } catch (e) {
        return;
      }
      // TODO: Make this condition clearer
      // as far as I understand, we could simplify it by:
      // youtube.lastNbSubscribers < nb && youtube.channel
      if (
        nb !== youtube.lastNbSubscribers &&
        Math.floor(youtube.lastNbSubscribers / youtube.interval) <
          Math.floor(nb / youtube.interval) &&
        youtube.channel
      ) {
        const oldcap = youtube.getNextCap(youtube.lastNbSubscribers);
        const cap = youtube.getNextCap(nb);
        let message;
        if (oldcap < cap && youtube.capmessages.length > 0) {
          message = youtube.capmessages[Math.floor(Math.random() * youtube.capmessages.length)];
        } else {
          message = youtube.messages[Math.floor(Math.random() * youtube.messages.length)];
        }
        message = message.replace(new RegExp('%total%', 'g'), Utils.spacer(nb));
        message = message.replace(new RegExp('%cap%', 'g'), Utils.spacer(cap));
        message = message.replace(new RegExp('%oldcap%', 'g'), Utils.spacer(oldcap));
        message = message.replace(new RegExp('%cap-total%', 'g'), Utils.spacer(cap - nb));
        guild.channels.get(youtube.channel).send(message);
      }
      if (nb !== youtube.lastNbSubscribers) {
        youtube.lastNbSubscribers = nb;
      }
    }
  );
};
module.exports = youtubeRequest;

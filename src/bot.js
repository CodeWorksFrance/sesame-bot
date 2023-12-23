import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
import environment from './environment.js';

const slackBot = () => {
  const rTMClient = new RTMClient(environment.slackToken);
  const webClient = new WebClient(environment.slackToken);
  return {
    on: rTMClient.on,
    getChannelById: webClient.users.identity,
    getUserById: webClient.conversations.info,
    postMessageToChannel: (channelName, message) => rTMClient.sendMessage(message, channelName),
    start: rTMClient.start
  };
};

export default class Bot {
  constructor(handler, messengerBot = slackBot()) {
    this.messengerBot = messengerBot;
    this.handler = handler;
  }

  startListening() {
    this.handleMessageEvent();
    
    this.messengerBot.on('error', (error) => {
      console.error('Error: %s', error);
    });

    (async () => {
      await this.messengerBot.start();
    })();
  }

  handleMessageEvent() {
    this.messengerBot.on('message', async event => {
      const type = event.type;

      if (type !== 'message') {
        return false;
      }

      const channel = await this.messengerBot.getChannelById(event.channel);
      const user = await this.messengerBot.getUserById(event.user);
      
      if (!user || !user.name || !channel) {
        return false;
      }

      const time = event.ts;
      const text = event.text;
      console.log('Received: %s %s @%s %s "%s"', type, (channel.is_channel ? '#' : '') + channel.name, user.name, time, text);
      
      if (!['open', 'ouvre', 'sesame'].some((item) => text.toLowerCase().indexOf(item) > -1)) {
        return false;
      }

      this.handler.triggerAction();

      const response = environment.botResponseMessageTemplate.replace('${userName}', user.name);
      await this.messengerBot.postMessageToChannel(channel.id, response)
      console.log('@%s responded with "%s"', this.messengerBot.self.name, response);
    });
  }
};

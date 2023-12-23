import Slackbot from 'slackbot';
import environment from './environment.js';

const slackBot = () => new Slackbot({
  token: environment.slackToken,
  name: 'Sesame'
});

export default class Bot {
  constructor(handler, messengerBot = slackBot()) {
    this.messengerBot = messengerBot;
    this.handler = handler;
  }

  startListening() {
    this.messengerBot.on('message', async message => {
      const type = message.type;

      if (type !== 'message') {
        return false;
      }

      const channel = await this.messengerBot.getChannelById(message.channel);
      const user = await this.messengerBot.getUserById(message.user);
      
      if (!user || !user.name || !channel) {
        return false;
      }

      const time = message.ts;
      const text = message.text;
      console.log('Received: %s %s @%s %s "%s"', type, (channel.is_channel ? '#' : '') + channel.name, user.name, time, text);
      
      if (!['open', 'ouvre', 'sesame'].some((item) => text.toLowerCase().indexOf(item) > -1)) {
        return false;
      }

      this.handler.triggerAction();

      const response = environment.botResponseMessageTemplate.replace('${userName}', user.name);
      await this.messengerBot.postMessageToChannel(channel.name, response)
      console.log('@%s responded with "%s"', this.messengerBot.self.name, response);
    });
    
    this.messengerBot.on('error', (error) => {
      console.error('Error: %s', error);
    });
  }
};

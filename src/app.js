const { Switch } = require('./switchGpio');
const { MessengerBot } = require('./slackSDK');

const SesameBot = (messengerBot) => {
  return {
    startListening: () => {
      messengerBot.start();
      messengerBot.handleMessage();
    }
  }
}

const sesameBot = SesameBot(MessengerBot(Switch()));
sesameBot.startListening();
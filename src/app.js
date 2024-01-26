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

const appStart = Date.now();
const sesameBot = SesameBot(MessengerBot(Switch(), appStart));
sesameBot.startListening();
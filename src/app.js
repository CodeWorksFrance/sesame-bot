const { App } = require('@slack/bolt');
const { environment } = require('./environment');

const SlackBot = () => {
  const slackEvent = new App({
    token: environment.slackBotToken,
    appToken: environment.slackAppToken,
    socketMode: true,
  });

  return {
    handleMessage : () => {
      slackEvent.event('message', async ({ event, say }) => {
        const user = event.user;
        const message = event.text;
        
        if (!['open', 'ouvre', 'sesame'].some((item) => message.toLowerCase().indexOf(item) > -1)) {
          return false;
        }
        
        say(`J\'ouvre de ce pas <@${user}>!.`);
        return true;
      });
    },
    start: async () => {
      await slackEvent.start();
      console.log('⚡️ Bolt app started');
    }
  }

}


const SesameBot = (handler, messengerBot) => {
  return {
    startListening: () => {
      messengerBot.start();
      if(messengerBot.handleMessage()) handler.triggerAction;
    }
  }
}

const Switch = () => {
  return {
    triggerAction: () => {console.log("action triggered")}
  }
}

const app = () => {
  const sesameBot = SesameBot(Switch(), SlackBot());
  sesameBot.startListening();
};

app();
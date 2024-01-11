const { App } = require('@slack/bolt');
const { environment } = require('./environment');

const SlackBot = (handler) => {
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
          handler.triggerAction();
        });
      },
      start: async () => {
        await slackEvent.start();
        console.log('⚡️ Bolt app started');
      }
    }
  }

exports.MessengerBot = SlackBot;
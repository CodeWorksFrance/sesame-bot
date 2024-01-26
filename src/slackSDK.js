const { App } = require('@slack/bolt');
const { environment } = require('./environment');

const SlackBot = (handler, appStartTime) => {
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
          const messageTime = new Date(event.ts * 1000);
          console.log("New message received");
          
          if (!['open', 'ouvre', 'sesame'].some((item) => message.toLowerCase().indexOf(item) > -1)) {
            console.log("IGNORED : message does not contain keyword to open the door.");
            return false;
          }

          if (appStartTime >= messageTime) {
            console.log("IGNORED : message was sent before app was started.");
            return false;
          } 
          
          say(`J\'ouvre de ce pas <@${user}>!.`);
          handler.triggerAction();
          console.log("ACCEPTED : door opened.");
        });
      },
      start: async () => {
        await slackEvent.start();
        console.log('⚡️ Bolt app started');
      }
    }
  }

exports.MessengerBot = SlackBot;
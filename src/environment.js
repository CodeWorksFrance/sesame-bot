const dotenv = require('dotenv');
dotenv.config();

const environment = {};

environment.doorTimeout = process.env.DOOR_TIMEOUT;
environment.relayGpioPort = process.env.RELAY_GPIO_PORT;
environment.slackBotToken = process.env.SLACK_BOT_TOKEN;
environment.slackAppToken = process.env.SLACK_APP_TOKEN;
environment.botChannelId = process.env.BOT_CHANNEL_ID;
 
exports.environment = environment;

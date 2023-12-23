import { expect } from 'chai';
import Bot from '../src/bot.js';

const dummyFunction = () => false;

let fakeMessengerMessageCallback;
const fakeMessengerBot = () => ({
  self: { name: 'fake messenger bot' },
  onMessage: (callback) => { fakeMessengerMessageCallback = callback },
  onError: dummyFunction,
  on: (event, callback) => {
    switch (event) {
      case 'message':
        return fakeMessengerBot().onMessage(callback);
      case 'error':
        return fakeMessengerBot().onError(callback);
      default:
        return dummyFunction();
    }
  },
  getChannelById: () => Promise.resolve({ name: 'channel' }),
  getUserById: () => Promise.resolve({ name: 'user' }),
  postMessageToChannel: dummyFunction,
  message: (message) => fakeMessengerMessageCallback(message)
});

describe('Bot when it starts listening', () => {
  let bot;

  beforeEach(() => {
    const fakeHandler = {
      isTrigger: false,
      triggerAction: () => { fakeHandler.isTrigger = true }
    };

    bot = new Bot(fakeHandler, fakeMessengerBot());
    bot.startListening();
  });

  it('should do nothing when the message type is not message', async () => {
    // Arrange & Act
    await bot.messengerBot.message({ type: 'notMessage' });

    // Assert
    expect(bot.handler.isTrigger).to.be.false;
  });

  it('should do nothing when the message user is not recognized', async () => {
    // Arrange
    bot.messengerBot.getUserById = async (_user) => null;

    // Act
    await bot.messengerBot.message({ type: 'message', user: 'notRecognized' });

    // Assert
    expect(bot.handler.isTrigger).to.be.false;
  });

  it('should do nothing when the message user name is not recognized', async () => {
    // Arrange
    bot.messengerBot.getUserById = async (_user) => ({ name: null });

    // Act
    await bot.messengerBot.message({ type: 'message', user: 'notRecognized' });

    // Assert
    expect(bot.handler.isTrigger).to.be.false;
  });

  it('should do nothing when the message channel is not recognized', async () => {
    // Arrange
    bot.messengerBot.getChannelById = async (_channel) => null;

    // Act
    await bot.messengerBot.message({ type: 'message', user: 'notRecognized' });

    // Assert
    expect(bot.handler.isTrigger).to.be.false;
  });

  it('should trigger when the message contains the word open', async () => {
    // Arrange & Act
    await bot.messengerBot.message({ type: 'message', text: 'open' });

    // Assert
    expect(bot.handler.isTrigger).to.be.true;
  });

  it('should trigger when the message contains the word ouvre', async () => {
    // Arrange & Act
    await bot.messengerBot.message({ type: 'message', text: 'ouvre' });

    // Assert
    expect(bot.handler.isTrigger).to.be.true;
  });

  it('should trigger when the message contains the word sesame', async () => {
    // Arrange & Act
    await bot.messengerBot.message({ type: 'message', text: 'sesame' });

    // Assert
    expect(bot.handler.isTrigger).to.be.true;
  });

  it('should do nothing when the message does not contain one of the specifics words', async () => {
    // Arrange & Act
    await bot.messengerBot.message({ type: 'message', text: 'close' });

    // Assert
    expect(bot.handler.isTrigger).to.be.false;
  });

  it('should post a message after triggering the action', async () => {
    // Arrange
    bot.messengerBot.getChannelById = async (channelId) => ({ id: channelId, name: 'channel' });
    let aMessageWasPosted = false;
    bot.messengerBot.postMessageToChannel = async (channelId, _message) => {
      expect(channelId).to.equal('channelId');
      aMessageWasPosted = true;
    };
    
    // Act
    await bot.messengerBot.message({ type: 'message', text: 'open', channel: 'channelId' });

    // Assert
    expect(aMessageWasPosted).to.be.true;
  });
});

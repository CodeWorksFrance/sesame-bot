const { environment } = require('./environment');
const { Gpio } = require('onoff');

const SwitchGpio = () => {
    const relay = new Gpio(environment.relayGpioPort, 'out');
    const close = () => {
      relay.writeSync(Gpio.HIGH);
    };
    
    close();
    
    return {
      triggerAction: () => {
        if (relay.readSync() === Gpio.HIGH) {
          relay.writeSync(Gpio.LOW);
          setTimeout(close, (environment.doorTimeout));
        }
      }
    }
  }

  exports.Switch = SwitchGpio;
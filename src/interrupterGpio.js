import { Gpio } from 'onoff';
import environment from './environment.js';

const relay = new Gpio(environment.relayGpioPort, 'out');

const close = () => {
  relay.writeSync(Gpio.LOW);
};

close();

const push = () => {
  if (relay.readSync() === Gpio.LOW) {
    relay.writeSync(Gpio.HIGH);
    setTimeout(close, (environment.doorTimeout));
  }
};

const interrupterGpio = { push };

export default interrupterGpio;

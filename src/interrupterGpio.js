import { Gpio } from 'onoff';
import environment from './environment.js';

const relay = new Gpio(environment.relayGpioPort, 'out');

const close = () => {
  relay.writeSync(1);
};

close();

const push = () => {
  if (relay.readSync() === 0) {
    relay.writeSync(1);
    setTimeout(close, (environment.doorTimeout));
  }
};
  
const interrupterGpio = { push };

export default interrupterGpio;

import interrupterGpio from './interrupterGpio.js';

const Interrupter = (interrupterAdapter = interrupterGpio) => ({
  push: () => interrupterAdapter.push()
});

export default Interrupter;

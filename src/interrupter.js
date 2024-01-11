
const Interrupter = (interrupterAdapter ) => ({
  push: () => interrupterAdapter.push()
});

export default Interrupter;

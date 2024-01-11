import { expect } from 'chai';
import Interrupter from '../src/interrupter.js';

describe('Interrupter', () => {
  it('should call the GPIO to trigger push', () => {
    // Arrange
    let adapterGpioPushCalled = false;
    const adapterGpio = {
      push: () => {
        adapterGpioPushCalled = true;
      }
    }
    const interrupter = Interrupter(adapterGpio);

    // Act
    interrupter.push()

    // Assert
    expect(adapterGpioPushCalled).to.be.true;
  });
});

import { expect } from 'chai';
import app from '../src/app.js';

describe('app', () => {
  it('should test', () => {
    expect(app(1, 1)).to.equal(2);
  });
});

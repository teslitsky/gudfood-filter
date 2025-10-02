import assert from 'node:assert';
import { describe, it } from 'node:test';
import parseCalories from './calories';

describe('Calories parser', () => {
  describe('should parse calories from valid text', () => {
    const cases: Array<[string, number]> = [
      ['229,500 ккал.', 229.5],
      ['366.63 ккал.', 366.63],
    ];

    for (const [input, expected] of cases) {
      it(`parses ${expected} calories from ${input}`, () => {
        assert.strictEqual(parseCalories(input), expected);
      });
    }
  });

  describe('should return zero from invalid text', () => {
    const cases: Array<[string, number]> = [
      ['', 0],
      ['foobar', 0],
      ['69', 0],
      ['ккал.', 0],
    ];

    for (const [input, expected] of cases) {
      it(`parses ${expected} calories from ${input}`, () => {
        assert.strictEqual(parseCalories(input), expected);
      });
    }
  });
});

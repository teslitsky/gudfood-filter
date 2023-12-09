import parseCalories from './calories';

describe('Calories parser', () => {
  describe('should parse calories from valid text', () => {
    test.each`
      text               | expected
      ${'229,500 ккал.'} | ${229.5}
      ${'366.63 ккал.'}  | ${366.63}
    `('parses $expected calories from $text', ({ text, expected }) => {
      expect(parseCalories(text)).toBe(expected);
    });
  });

  describe('should return zero from invalid text', () => {
    test.each`
      text        | expected
      ${''}       | ${0}
      ${'foobar'} | ${0}
      ${'69'}     | ${0}
      ${'ккал.'}  | ${0}
    `('parses $expected calories from $text', ({ text, expected }) => {
      expect(parseCalories(text)).toBe(expected);
    });
  });
});

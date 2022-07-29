import { parseCalories } from './calories';

describe('Calories parser', () => {
  it('should parse calories from valid text', () => {
    expect(parseCalories('229,500 ккал.')).toEqual(229.5);
    expect(parseCalories('366.63 ккал.')).toEqual(366.63);
  });

  it('should return zero from invalid text', () => {
    expect(parseCalories('')).toEqual(0);
    expect(parseCalories('foobar')).toEqual(0);
    expect(parseCalories('69')).toEqual(0);
  });
});

import { parseNutrients } from './nutrients';
import { NutrientsCount } from '../interfaces/nutrients-count';

describe('Nutrients parser', () => {
  it('should parse nutrients from valid text', () => {
    expect(
      parseNutrients('*Б 6,633г/ Ж 27,774.Г/ У 16,647Г'),
    ).toMatchObject<NutrientsCount>({
      proteins: 6.633,
      fats: 27.774,
      carbs: 16.647,
    });

    expect(
      parseNutrients('Б 12.95г/ Ж 18.16г/ У 37.86г'),
    ).toMatchObject<NutrientsCount>({
      proteins: 12.95,
      fats: 18.16,
      carbs: 37.86,
    });
  });

  it('should return zero for empty text', () => {
    expect(parseNutrients('')).toMatchObject<NutrientsCount>({
      proteins: 0,
      fats: 0,
      carbs: 0,
    });
  });

  it('should return zero for invalid text', () => {
    expect(parseNutrients('Lorem ipsum#')).toMatchObject<NutrientsCount>({
      proteins: 0,
      fats: 0,
      carbs: 0,
    });
  });

  it('should parse incomplete text', () => {
    expect(parseNutrients('Ж 27,774Г')).toMatchObject<NutrientsCount>({
      proteins: 0,
      fats: 0,
      carbs: 0,
    });
  });
});

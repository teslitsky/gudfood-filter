import assert from 'node:assert';
import { it, describe } from 'node:test';
import parseNutrients from './nutrients';
import { NutrientsCount } from '../interfaces/nutrients-count';

describe('Nutrients parser', () => {
  it('should parse nutrients from valid text', () => {
    assert.deepStrictEqual<NutrientsCount>(
      parseNutrients('*Б 6,633г/ Ж 27,774.Г/ У 16,647Г'),
      {
        proteins: 6.633,
        fats: 27.774,
        carbs: 16.647,
      },
    );

    assert.deepStrictEqual<NutrientsCount>(
      parseNutrients('Б 12.95г/ Ж 18.16г/ У 37.86г'),
      {
        proteins: 12.95,
        fats: 18.16,
        carbs: 37.86,
      },
    );
  });

  it('should return zero for empty text', () => {
    assert.deepStrictEqual<NutrientsCount>(parseNutrients(''), {
      proteins: 0,
      fats: 0,
      carbs: 0,
    });
  });

  it('should return zero for invalid text', () => {
    assert.deepStrictEqual<NutrientsCount>(parseNutrients('Lorem ipsum#'), {
      proteins: 0,
      fats: 0,
      carbs: 0,
    });
  });

  it('should parse incomplete text', () => {
    assert.deepStrictEqual<NutrientsCount>(parseNutrients('Ж 27,774Г'), {
      proteins: 0,
      fats: 0,
      carbs: 0,
    });
  });
});

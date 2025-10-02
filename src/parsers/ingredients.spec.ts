import assert from 'node:assert';
import { describe, it } from 'node:test';
import parseIngredients from './ingredients';

describe('Ingredients parser', () => {
  it('should parse ingredients from valid text', () => {
    assert.deepStrictEqual(
      parseIngredients(
        "Цибуля ріпчаста, часник свіжий, сіль кам'яна, перець чилі, олія оливкова, баклажан, перець болгарський, цукор, соус соєвий, імбир корінь, паста томатна, оцет яблучний, олія кунжутна, вода, крупа гречана, олія соняшникова.",
      ),
      [
        'цибуля ріпчаста',
        'часник свіжий',
        "сіль кам'яна",
        'перець чилі',
        'олія оливкова',
        'баклажан',
        'перець болгарський',
        'цукор',
        'соус соєвий',
        'імбир корінь',
        'паста томатна',
        'оцет яблучний',
        'олія кунжутна',
        'вода',
        'крупа гречана',
        'олія соняшникова',
      ],
    );

    assert.deepStrictEqual(
      parseIngredients(
        'борошно в/с, майонез(яйця курячі, олія соняшникова, сіль, оцет столовий 9%),сметана',
      ),
      [
        'борошно в/с',
        'майонез',
        'яйця курячі',
        'олія соняшникова',
        'сіль',
        'оцет столовий 9%',
        'сметана',
      ],
    );
  });

  it('should return empty array from invalid text', () => {
    assert.deepStrictEqual(parseIngredients(''), []);
    assert.deepStrictEqual(parseIngredients('foobar 69'), []);
  });
});

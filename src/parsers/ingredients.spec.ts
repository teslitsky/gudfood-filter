import parseIngredients from './ingredients';

describe('Ingredients parser', () => {
  it('should parse ingredients from valid text', () => {
    expect(
      parseIngredients(
        "Цибуля ріпчаста, часник свіжий, сіль кам'яна, перець чилі, олія оливкова, баклажан, перець болгарський, цукор, соус соєвий, імбир корінь, паста томатна, оцет яблучний, олія кунжутна, вода, крупа гречана, олія соняшникова.",
      ),
    ).toEqual([
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
    ]);

    expect(
      parseIngredients(
        'борошно в/с, майонез(яйця курячі, олія соняшникова, сіль, оцет столовий 9%),сметана',
      ),
    ).toEqual([
      'борошно в/с',
      'майонез',
      'яйця курячі',
      'олія соняшникова',
      'сіль',
      'оцет столовий 9%',
      'сметана',
    ]);
  });

  it('should return empty array from invalid text', () => {
    expect(parseIngredients('')).toEqual([]);
    expect(parseIngredients('foobar 69')).toEqual([]);
  });
});

import { NutrientsCount } from '../interfaces/nutrients-count';

const zero = {
  proteins: 0,
  fats: 0,
  carbs: 0,
} as NutrientsCount;

export function parseNutrients(text = ''): NutrientsCount {
  if (!text) {
    return zero;
  }

  const textToParse = text.toLowerCase();
  const nutrients = textToParse.split('/').map((nutrient) => {
    let filteredText = nutrient
      .replace('б', '')
      .replace('ж', '')
      .replace('у', '')
      .replace('г', '')
      .replace('*', '');

    if (filteredText.includes(',')) {
      filteredText = filteredText.replace('.', '').replace(',', '.');
    }

    return Number(filteredText.trim());
  });

  if (nutrients.length !== 3) {
    return zero;
  }

  const [proteins, fats, carbs] = nutrients;

  return {
    proteins,
    fats,
    carbs,
  };
}

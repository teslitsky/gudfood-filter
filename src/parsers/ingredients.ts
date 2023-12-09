export default function parseIngredients(text = ''): string[] {
  if (!text) {
    return [];
  }

  const parsedText = text
    .toLowerCase()
    .replace('(', ',')
    .replace(')', '')
    .replace('.', '')
    .trim();

  if (!parsedText.includes(',')) {
    return [];
  }

  return parsedText.split(',').map((ingredient) => ingredient.trim());
}

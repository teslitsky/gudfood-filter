const CALORIES_LABEL = 'ккал.';

export default function parseCalories(text = ''): number {
  const parsedText = text.toLowerCase().trim();

  if (!parsedText.includes(CALORIES_LABEL)) {
    return 0;
  }

  const calories = parsedText.replace(CALORIES_LABEL, '').replace(',', '.');

  return Number(calories) || 0;
}

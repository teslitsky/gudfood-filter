import { Nutrients } from './nutrients';

export interface NutrientsCount {
  [Nutrients.Proteins]: number;
  [Nutrients.Fats]: number;
  [Nutrients.Carbs]: number;
}

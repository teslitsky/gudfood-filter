import parseNutrients from './parsers/nutrients';
import Nutrients from './interfaces/nutrients';
import parseCalories from './parsers/calories';
import parseIngredients from './parsers/ingredients';

const ingredientsSet = new Set<string>();
const selectedIngredients = new Set<string>();

const filter = {
  ingredients: [],
  calories: { min: 0, max: Infinity },
  proteins: { min: 0, max: Infinity },
  fats: { min: 0, max: Infinity },
  carbs: { min: 0, max: Infinity },
};

let maxCalories = 0;
let maxProteins = 0;
let maxFats = 0;
let maxCarbs = 0;

$(() => {
  $('.product-row').each(function () {
    const current = $(this);

    const descriptionText = current.find('p').first().text().trim();
    const nutrientsText = current.find('p:eq(1)').text().trim();
    const caloriesText = current.find('p:eq(2)').text().trim();

    const calories = parseCalories(caloriesText);
    current.attr('calories', calories);
    maxCalories = Math.max(maxCalories, calories);

    const { proteins, fats, carbs } = parseNutrients(nutrientsText);

    current.attr(Nutrients.Proteins, proteins);
    maxProteins = Math.max(maxProteins, proteins);

    current.attr(Nutrients.Fats, fats);
    maxFats = Math.max(maxFats, fats);

    current.attr(Nutrients.Carbs, carbs);
    maxCarbs = Math.max(maxCarbs, carbs);

    const ingredients = parseIngredients(descriptionText);
    ingredients.forEach((ingredient: string) => ingredientsSet.add(ingredient));
    current.attr('ingredients', ingredients.join(','));
  });

  renderFilterBox({
    calories: Math.ceil(maxCalories),
    proteins: Math.ceil(maxProteins),
    fats: Math.ceil(maxFats),
    carbs: Math.ceil(maxCarbs),
    ingredients: Array.from(ingredientsSet),
  });

  $('#resetIngredients').on('click', (e) => {
    e.preventDefault();
    $('input[name="ingredients"]').prop('checked', false);
    selectedIngredients.clear();
    filterIngredients();
  });

  $('input[name="ingredients"]').on('change', () => {
    selectedIngredients.clear();
    [...document.querySelectorAll('input[name="ingredients"]:checked')].forEach(
      (element: Element) => {
        console.log(element);
        console.log($(element).val());
        const value = $(element).val();
        if (value) {
          selectedIngredients.add(value.toString().trim());
        }
      },
    );

    filterIngredients();
  });

  renderBadges();
});

function renderCaloriesRange(): string {
  return `
    <div style="padding: 0 0 15px">
    <label for="calories">Енергетична цінність:</label>
    <input type="text" id="calories" readonly style="border:0;">
    <div id="slider-range-calories"></div>
  </div>`;
}

function renderProteinsRange(): string {
  return `
    <div style="padding: 0 0 15px">
    <label for="proteins">Білки:</label>
    <input type="text" id="proteins" readonly style="border:0;">
    <div id="slider-range-proteins"></div>
  </div>`;
}

function renderFatsRange(): string {
  return `
    <div style="padding: 0 0 15px">
    <label for="fats">Жири:</label>
    <input type="text" id="fats" readonly style="border:0;">
    <div id="slider-range-fats"></div>
  </div>`;
}

function renderCarbsRange(): string {
  return `
    <div style="padding: 0 0 15px">
    <label for="carbs">Вуглеводи:</label>
    <input type="text" id="carbs" readonly style="border:0;">
    <div id="slider-range-carbs"></div>
  </div>`;
}

function renderFilterBox({
  calories,
  proteins,
  fats,
  carbs,
  ingredients,
}: {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  ingredients: string[];
}): void {
  const caloriesContent = renderCaloriesRange();
  const proteinsContent = renderProteinsRange();
  const fatsContent = renderFatsRange();
  const carbsContent = renderCarbsRange();
  const ingredientsContent = renderIngredients(ingredients);

  $('#cart')
    .parent()
    .parent()
    .append(
      `<div class="panel panel-info">
        <div class="panel-heading">
          <h3 class="panel-title">Фільтр</h3>
        </div>
        <div class="panel-body" id="filter-box">
          ${caloriesContent}
          ${proteinsContent}
          ${fatsContent}
          ${carbsContent}
          ${ingredientsContent}
        </div>
      </div>`,
    );

  const caloriesSlider = $('#slider-range-calories');
  caloriesSlider.slider({
    range: true,
    min: 0,
    max: calories,
    values: [0, calories],
    slide: function slideChange(event, ui) {
      const min = ui.values?.[0] || 0;
      const max = ui.values?.[1] || Infinity;
      $('#calories').val(`${min} - ${max} ккал.`);
      filter.calories.min = min;
      filter.calories.max = max;
      filterIngredients();
    },
  });

  $('#calories').val(
    `${caloriesSlider.slider('values', 0)} - ${caloriesSlider.slider(
      'values',
      1,
    )} ккал.`,
  );

  const proteinsSlider = $('#slider-range-proteins');
  proteinsSlider.slider({
    range: true,
    min: 0,
    max: proteins,
    values: [0, proteins],
    slide: (event, ui) => {
      const min = ui.values?.[0] || 0;
      const max = ui.values?.[1] || Infinity;

      $('#proteins').val(`${min} - ${max} грам`);
      filter.proteins.min = min;
      filter.proteins.max = max;
      filterIngredients();
    },
  });

  $('#proteins').val(
    `${proteinsSlider.slider('values', 0)} - ${proteinsSlider.slider(
      'values',
      1,
    )} грам`,
  );

  const fatsSlider = $('#slider-range-fats');
  fatsSlider.slider({
    range: true,
    min: 0,
    max: fats,
    values: [0, fats],
    slide: (event, ui) => {
      const min = ui.values?.[0] || 0;
      const max = ui.values?.[1] || Infinity;

      $('#fats').val(`${min} - ${max} грам`);
      filter.fats.min = min;
      filter.fats.max = max;
      filterIngredients();
    },
  });

  $('#fats').val(
    `${fatsSlider.slider('values', 0)} - ${fatsSlider.slider(
      'values',
      1,
    )} грам`,
  );

  const carbsSlider = $('#slider-range-carbs');
  carbsSlider.slider({
    range: true,
    min: 0,
    max: carbs,
    values: [0, carbs],
    slide: (event, ui) => {
      const min = ui.values?.[0] || 0;
      const max = ui.values?.[1] || Infinity;

      $('#carbs').val(`${min} - ${max} грам`);
      filter.carbs.min = min;
      filter.carbs.max = max;
      filterIngredients();
    },
  });

  $('#carbs').val(
    `${carbsSlider.slider('values', 0)} - ${carbsSlider.slider(
      'values',
      1,
    )} грам`,
  );
}

function renderIngredients(ingredients: string[] = []): string {
  const content = ingredients.sort().reduce(
    (acc, i) => `${acc}<div class="checkbox">
    <label>
      <input type="checkbox" name="ingredients" value="${i}">${i}
    </label>
  </div>`,
    `<div>
      <button class="btn btn-sm btn-warning" id="resetIngredients">Скинути</button>
    </div>`,
  );

  return `<div style="padding: 0 0 15px">
    <h5>Складові</h5>
    ${content}
  </div>`;
}

function filterIngredients(): void {
  $('.product-row.hide').removeClass('hide');
  $('.product-row')
    .filter(function filterProducts() {
      const calories = Number($(this).attr('calories'));
      const proteins = Number($(this).attr('proteins'));
      const fats = Number($(this).attr('fats'));
      const carbs = Number($(this).attr('carbs'));
      const ingredients = $(this).attr('ingredients')?.split(',') || [];

      return (
        calories < filter.calories.min ||
        calories > filter.calories.max ||
        proteins < filter.proteins.min ||
        proteins > filter.proteins.max ||
        fats < filter.fats.min ||
        fats > filter.fats.max ||
        carbs < filter.carbs.min ||
        carbs > filter.carbs.max ||
        !hasSelectedIngredients(selectedIngredients, ingredients)
      );
    })
    .addClass('hide');
  updateBadges();
}

function hasSelectedIngredients(selected: Set<string>, ingredients: string[]) {
  if (ingredientsSet.size === selected.size) {
    // All items selected
    return true;
  }

  if (!selected || !selected.size) {
    return true;
  }

  const setB = new Set(ingredients);
  return (
    [...new Set(selected)].filter((x) => setB.has(x)).length === selected.size
  );
}

function countShowedItemsForTab(id: string): number {
  if (!id) {
    return 0;
  }

  return $(`div.tab-pane${id}`).find('.product-row').not('.hide').length;
}

function renderBadges(): void {
  $('ul.nav-tabs > li').each(function eachTab() {
    const link = $(this).find('a');
    const href = link.attr('href');
    if (href) {
      link.append(
        `&nbsp;<span class="badge">${countShowedItemsForTab(href)}</span>`,
      );
    }
  });
}

function updateBadges(): void {
  $('ul.nav-tabs > li').each(function eachTab() {
    const link = $(this).find('a');
    const badge = link.find('.badge');
    const href = link.attr('href');
    if (href) {
      badge.html(countShowedItemsForTab(href).toString());
    }
  });
}

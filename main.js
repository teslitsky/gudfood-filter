/* eslint-disable no-console */
// @TODO: add range debounce
// @TODO: remove jQuery if can not reuse it
// @TODO: add state
// @TODO: refactor view + model layers
// @TODO: add cart total
const ingredientsSet = new Set();
const selectedIngredients = new Set();

const filter = {
  ingredients: [],
  calories: { min: 0, max: Infinity },
  proteins: { min: 0, max: Infinity },
  fats: { min: 0, max: Infinity },
  carbs: { min: 0, max: Infinity },
};

let caloriesMax = 0;
let proteinsMax = 0;
let fatsMax = 0;
let carbsMax = 0;

function hasSelectedIngredients(selected, ingredients) {
  if (ingredientsSet.size === selected.size) {
    // All items selected
    return true;
  }

  if (!selected || !selected.size) {
    return true;
  }

  const setB = new Set(ingredients);
  return (
    [...new Set(selected)].filter(x => setB.has(x)).length === selected.size
  );
}

function parseTitle(text) {
  const needle = '              ';
  const needleIndex = text.indexOf(needle);

  return text.slice(0, needleIndex);
}

function parseIngredients(text) {
  const needle = '              ';
  const startIndex = text.indexOf(needle) + needle.length;
  const endIndex = text.indexOf(' Енер');

  const ingredients = text
    .slice(startIndex, endIndex)
    .replace('.', '')
    .replace(/\n/g, '')
    .replace(')', '')
    .trim()
    .toLowerCase()
    .split(',');

  return ingredients.map(el => {
    // case "соус медово-гірчичний (американська гірчиця, фреш лимону, мед)"
    const openIndex = el.indexOf('(');
    if (openIndex >= 0) {
      return el.slice(openIndex + 1);
    }

    return el.trim();
  });
}

function parseCalories(text) {
  const startIndex = text.indexOf('цінність') + 'цінність'.length;
  const endIndex = text.indexOf('ккал');
  if (!startIndex || endIndex <= 0) {
    console.warn(`No calories for "${parseTitle(text)}"`);
    return false;
  }

  const calories = text
    .slice(startIndex, endIndex)
    .replace(/\n/g, '')
    .replace(/-/g, '')
    .replace('. ', '.')
    .replace(/:/g, '')
    .replace(/,/g, '.')
    .trim();

  return Number(calories);
}

function parseProteins(text) {
  const needle = 'Білки';
  const startIndex = text.indexOf(needle);
  const endIndex = text.indexOf('гр', startIndex);
  if (startIndex <= 0 || endIndex <= 0) {
    console.warn(`No proteins for "${parseTitle(text)}"`);
    return false;
  }

  const proteins = text
    .slice(startIndex + needle.length, endIndex)
    .replace(/\n/g, '')
    .replace(/-/g, '')
    .replace(/:/g, '')
    .replace(/,/g, '.')
    .trim();

  return Number(proteins);
}

function parseFats(text) {
  const needle = 'жири';
  const startIndex = text.indexOf(needle);
  const endIndex = text.indexOf('гр', startIndex);
  if (startIndex <= 0 || endIndex <= 0) {
    console.warn(`No fats for "${parseTitle(text)}"`);
    return false;
  }

  const fats = text
    .slice(startIndex + needle.length, endIndex)
    .replace(/\n/g, '')
    .replace(/-/g, '')
    .replace(/:/g, '')
    .replace(/,/g, '.')
    .trim();

  return Number(fats);
}

function parseCarbs(text) {
  const needle = 'вуглеводи';
  const startIndex = text.indexOf(needle);
  if (startIndex <= 0) {
    console.warn(`No carbs for "${parseTitle(text)}"`);
    return false;
  }

  const carbs = text
    .slice(startIndex + needle.length)
    .replace('гр.', '')
    .replace('гр', '')
    .replace(/\n/g, '')
    .replace(/-/g, '')
    .replace(/:/g, '')
    .replace(/,/g, '.')
    .trim();

  return Number(carbs);
}

function countShowedItemsForTab(id) {
  if (!id) {
    return 0;
  }

  return $(`div.tab-pane${id}`)
    .find('.product-row')
    .not('.hide').length;
}

function renderBadges() {
  $('ul.nav-tabs > li').each(function eachTab() {
    const link = $(this).find('a');
    link.append(
      `&nbsp;<span class="badge">${countShowedItemsForTab(
        link.attr('href'),
      )}</span>`,
    );
  });
}

function updateBadges() {
  $('ul.nav-tabs > li').each(function eachTab() {
    const link = $(this).find('a');
    const badge = link.find('.badge');
    badge.html(countShowedItemsForTab(link.attr('href')));
  });
}

function filterIngredients() {
  $('.product-row.hide').removeClass('hide');
  $('.product-row')
    .filter(function filterProducts() {
      const calories = $(this).attr('calories');
      const proteins = $(this).attr('proteins');
      const fats = $(this).attr('fats');
      const carbs = $(this).attr('carbs');
      const ingredients = $(this)
        .attr('ingredients')
        .split(',');

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

function renderCaloriesRange() {
  return `
    <div style="padding: 0 0 15px">
    <label for="calories">Енергетична цінність:</label>
    <input type="text" id="calories" readonly style="border:0;">
    <div id="slider-range-calories"></div>
  </div>`;
}

function renderProteinsRange() {
  return `
    <div style="padding: 0 0 15px">
    <label for="proteins">Білки:</label>
    <input type="text" id="proteins" readonly style="border:0;">
    <div id="slider-range-proteins"></div>
  </div>`;
}

function renderFatsRange() {
  return `
    <div style="padding: 0 0 15px">
    <label for="fats">Жири:</label>
    <input type="text" id="fats" readonly style="border:0;">
    <div id="slider-range-fats"></div>
  </div>`;
}

function renderCarbsRange() {
  return `
    <div style="padding: 0 0 15px">
    <label for="carbs">Вуглеводи:</label>
    <input type="text" id="carbs" readonly style="border:0;">
    <div id="slider-range-carbs"></div>
  </div>`;
}

function renderIngredients(ingredients = []) {
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

function renderFilterBox({ calories, proteins, fats, carbs, ingredients }) {
  const caloriesContent = renderCaloriesRange(calories);
  const proteinsContent = renderProteinsRange(proteins);
  const fatsContent = renderFatsRange(fats);
  const carbsContent = renderCarbsRange(carbs);
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
    max: calories.max,
    values: [0, calories.max],
    slide: function slideChange(event, ui) {
      const min = ui.values[0];
      const max = ui.values[1];
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
    max: proteins.max,
    values: [0, proteins.max],
    slide: function slideChange(event, ui) {
      const min = ui.values[0];
      const max = ui.values[1];
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
    max: fats.max,
    values: [0, fats.max],
    slide: function slideChange(event, ui) {
      const min = ui.values[0];
      const max = ui.values[1];
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
    max: carbs.max,
    values: [0, carbs.max],
    slide: function slideChange(event, ui) {
      const min = ui.values[0];
      const max = ui.values[1];
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

$(document).ready(function ready() {
  $('.product-row').each(function eachRow() {
    const current = $(this);
    const text = current
      .find('.media-body .col-md-8')
      .text()
      .trim();

    const ingredients = parseIngredients(text);
    current.attr('ingredients', ingredients);
    ingredients.forEach(ingredient => ingredientsSet.add(ingredient));

    const calories = parseCalories(text);
    caloriesMax = calories > caloriesMax ? calories : caloriesMax;
    current.attr('calories', calories);

    const proteins = parseProteins(text);
    proteinsMax = proteins > proteinsMax ? proteins : proteinsMax;
    current.attr('proteins', proteins);

    const fats = parseFats(text);
    fatsMax = fats > fatsMax ? fats : fatsMax;
    current.attr('fats', fats);

    const carbs = parseCarbs(text);
    carbsMax = carbs > carbsMax ? carbs : carbsMax;
    current.attr('carbs', carbs);
  });

  renderFilterBox({
    calories: { min: 0, max: Math.ceil(caloriesMax) },
    proteins: { min: 0, max: Math.ceil(proteinsMax) },
    fats: { min: 0, max: Math.ceil(fatsMax) },
    carbs: { min: 0, max: Math.ceil(carbsMax) },
    ingredients: Array.from(ingredientsSet),
  });

  $('#resetIngredients').click(e => {
    e.preventDefault();
    $('input[name="ingredients"]').prop('checked', false);
    selectedIngredients.clear();
    filterIngredients();
  });

  $('input[name="ingredients"]').change(function clickFilterCheckbox() {
    selectedIngredients.clear();
    [...document.querySelectorAll('input[name="ingredients"]:checked')].forEach(
      ({ value }) => {
        selectedIngredients.add(value);
      },
    );

    filterIngredients();
  });

  renderBadges();
});

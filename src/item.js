import price from './price.js';
import recipe from './recipe.js';

function enrichPrice(item) {
  item.price = price(item.name);

  // TODO add recursion for reagents
  item.resources.forEach((resource) => {
    if (!resource.choices) {
      resource.price = price(resource.name);
    } else {
      resource.choices.forEach((choice) => {
        choice.price = price(choice.name);
      });
      resource.choices.sort((a, b) => {
        if (!a.price) {
          return 1;
        }
        if (!b.price) {
          return -1;
        }
        return a.price.price - b.price.price;
      });
      resource.price = resource.choices[0].price;
    }
  });

  const itemPrices = item.resources
    .filter((r) => r.price)
    .map((r) => r.price.price * r.quantity);
  if (!itemPrices.length) {
    console.info(`skipping ${item.name}, no item prices`);
    return;
  }
  item.sellPrice = item.price.price * item.outputQuantity;
  item.craftPrice = itemPrices.reduce((acc, val) => acc + val, 0);
  item.profit = Math.floor(item.sellPrice - item.craftPrice);
}

export default function get() {
  const recipes = recipe();

  const items = [];

  for (const recipe of recipes) {
    try {
      enrichPrice(recipe);
      items.push(recipe);
    } catch (e) {
      // console.error(e);
    }
  }

  items.sort((a, b) => b.profit - a.profit);

  return items;
}

import price from './price.js';
import recipes from '../data/recipes.json' assert { type: 'json' };

// stores recipes by name
const map = {};

// transforms json recipe into app entity
function transformer(item) {
  return {
    id: item.id,
    itemId: item.item_id,
    name: item.title.split(' [Recipe]')[0],
    outputQuantity: item.output_quantity,
    tradeSkill: item.tradeskill,
    tradeSkillLevel: item.tradeskill_level,
    resources: item.resources.map((i) => {
      const resource = {
        name: i.title,
        quantity: i.quantity,
      };

      if (i.group) {
        resource.choices = i.group.map((resource) => ({
          name: resource.title,
        }));
      }

      return resource;
    }),
  };
}

function enrichPrice(item) {
  if (item.name === 'Orichalcum Arrow') {
    console.log('sop');
  }
  item.price = price(item.name);
  if (!item.price) {
    return;
  }

  // TODO skip items that donot have price (event on reagents)
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
}

recipes.forEach((i) => {
  const item = transformer(i);

  enrichPrice(item);

  map[item.name] = item;
});

export default function get(name) {
  if (name) {
    return map[name];
  }

  const items = Object.values(map);
  items.sort(
    (a, b) => b.sellPrice - a.craftPrice - (a.sellPrice - a.craftPrice)
  );

  return items;
}

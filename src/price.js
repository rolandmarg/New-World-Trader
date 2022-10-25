import prices from '../data/prices.json' assert { type: 'json' };

const map = {};

function transformer(item) {
  return {
    name: item.ItemName,
    price: +item.Price,
    availability: +item.Availability,
    lastUpdated: item.LastUpdated,
  };
}

prices.forEach((i) => {
  const item = transformer(i);

  map[item.name] = item;
});

export default function get(name) {
  if (name) {
    if (!map[name]) {
      throw new Error('Price not found for ' + name);
    }

    return map[name];
  }

  return Object.values(map);
}

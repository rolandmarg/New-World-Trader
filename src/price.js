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
  return map[name];
}

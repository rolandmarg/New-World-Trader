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

// TODO add recursion for resources
function initRecipes() {
  recipes.forEach((i) => {
    const item = transformer(i);

    map[item.name] = item;
  });

}

initRecipes();

export default function get(name) {
  if (name) {
    if (!map[name]) {
      throw new Error('Recipe not found for ' + name);
    }
    return map[name];
  }

  return Object.values(map);
}

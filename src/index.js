import recipe from './recipe.js';

async function bootstrap() {
  const items = recipe().slice(0, 5);

  console.log(items);
}

bootstrap();

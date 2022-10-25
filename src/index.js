import item from './item.js';

async function bootstrap() {
  const items = item();

  console.log(items);
}

bootstrap();

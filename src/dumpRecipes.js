import fs from 'fs';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  let page = 1;
  const limit = 20;

  let url = `${process.env.API_RECIPE_LIST_URL}&page=${page}&limit=${limit}`;
  let response = await fetch(url);
  let data = await response.json();

  const total = data.total;
  const recipes = data.rows;

  while (page * limit < total) {
    page++;
    console.log(`fetching page ${page}, total ${Math.ceil(total / limit)}`);
    url = `${process.env.API_RECIPE_LIST_URL}&page=${page}&limit=${limit}`;
    response = await fetch(url);
    data = await response.json();
    recipes.push(...data.rows);
  }

  fs.writeFileSync(`./data/recipes.json`, JSON.stringify(recipes), {
    encoding: 'utf8',
  });
}

bootstrap();

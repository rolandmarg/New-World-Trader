import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config()

async function bootstrap() {
  const eldoradoId = 2;
  const url = `${process.env.API_MARKET_PRICE_URL}/${eldoradoId}`;

  const streamPipeline = promisify(pipeline);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const dumpPath = './data/prices.json';
  await streamPipeline(response.body, createWriteStream(dumpPath));
}

bootstrap();
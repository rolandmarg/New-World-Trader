import fs from 'fs';
import item from './item.js';

async function bootstrap() {
  const items = item();

  let output = '';
  for (const item of items) {
    output += `${item.name.padEnd(45, ' ')}`;
    output += `prft-${item.profit.toString().padEnd(20, ' ')}`;
    output += `${item.tradeSkill.padEnd(10, ' ')}`;
    output += ` ${item.tradeSkillLevel.toString().padEnd(5, ' ')}\n`;
  }

  fs.writeFileSync('./data/out.txt', output);
}

bootstrap();

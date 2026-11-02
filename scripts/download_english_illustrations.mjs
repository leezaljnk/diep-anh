import { mkdir, writeFile } from 'node:fs/promises';

export const ENGLISH_ILLUSTRATIONS = {
  pen: '1f58a', pencil: '270f', ruler: '1f4cf', book: '1f4d6', bag: '1f392', door: '1f6aa', window: '1fa9f',
  cat: '1f408', dog: '1f415', bird: '1f426', fish: '1f41f', duck: '1f986', frog: '1f438',
  tiger: '1f405', monkey: '1f412', elephant: '1f418', rabbit: '1f407', cow: '1f404',
  apple: '1f34e', banana: '1f34c', bread: '1f35e', cake: '1f370', ice_cream: '1f366', cookie: '1f36a',
  milk: '1f95b', water: '1f4a7', pizza: '1f355', carrot: '1f955',
};

const directory = new URL('../public/english/images/illustrated/', import.meta.url);
await mkdir(directory, { recursive: true });
const entries = Object.entries(ENGLISH_ILLUSTRATIONS);
for (let offset = 0; offset < entries.length; offset += 4) {
  await Promise.all(entries.slice(offset, offset + 4).map(async ([id, code]) => {
    const response = await fetch(`https://cdn.jsdelivr.net/gh/jdecked/twemoji@v16.0.1/assets/72x72/${code}.png`);
    if (!response.ok) throw new Error(`${id}: HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error(`${id}: not a PNG`);
    await writeFile(new URL(`${id}.png`, directory), bytes);
  }));
}
console.log(`Downloaded ${entries.length} English illustrations (Twemoji v16.0.1, CC BY 4.0).`);
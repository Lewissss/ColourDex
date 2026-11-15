import {readFileSync,readdirSync} from 'node:fs';import {validateCatalogue} from '../src/validation.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8')),palette=read('content/palette/kalour-240.json'),index=read('content/pokemon/index.json');
if(readdirSync('content/pokemon').filter(f=>f.endsWith('.json')&&f!=='index.json').length!==index.pokemon.length)throw Error('Unindexed guide');
const guides=index.pokemon.map(p=>read('content/pokemon/'+p.file));validateCatalogue(index,guides,palette);
if(process.argv.includes('--links'))for(const g of guides){const r=await fetch(g.artwork.url,{signal:AbortSignal.timeout(20000)});if(!r.ok||!r.headers.get('content-type')?.startsWith('image/'))throw Error('Artwork unavailable: '+g.artwork.url);await r.arrayBuffer();}
console.log(`Validated ${guides.length} complete guides and all 240 unique Kalour numbers${process.argv.includes('--links')?'; official images passed':''}.`);

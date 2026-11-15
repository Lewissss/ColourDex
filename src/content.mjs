import {validateCatalogue,validate} from './validation.mjs';
export const contentConfig={owner:'Lewissss',repository:'ColourDex',branch:'main',ttl:300000};
export async function loadRemote(config=contentConfig,fetcher=fetch){
 const root=`https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}`;
 async function json(url){const r=await fetcher(url,{cache:'no-store',signal:AbortSignal.timeout(15000),headers:{Accept:'application/vnd.github+json'}});if(!r.ok)throw Error(`Content source returned ${r.status}`);return r.json();}
 const commit=await json(`${root}/commits/${encodeURIComponent(config.branch)}`);if(!/^[a-f0-9]{40}$/.test(commit.sha))throw Error('Invalid content revision');
 const base=`https://raw.githubusercontent.com/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/${commit.sha}/content`;
 const [index,palette]=await Promise.all([json(`${base}/pokemon/index.json`),json(`${base}/palette/kalour-240.json`)]);validate('index',index);
 const guides=await Promise.all(index.pokemon.map(p=>json(`${base}/pokemon/${p.file}`)));
 return {...validateCatalogue(index,guides,palette),sha:commit.sha,checkedAt:Date.now()};
}

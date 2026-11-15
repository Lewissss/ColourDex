import {loadRemote,contentConfig} from '../src/content.mjs';
const branch=process.argv[2]||'main',result=await loadRemote({...contentConfig,branch});console.log(JSON.stringify({branch,commit:result.sha,guides:result.guides.length,pencils:result.palette.pencils.length,validated:true},null,2));

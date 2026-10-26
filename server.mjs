import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
http.createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(path.includes('..'))throw Error();const name=path==='/'?'index.html':path.slice(1);const data=await readFile(root+name);res.setHeader('Content-Type',({'html':'text/html','css':'text/css','js':'text/javascript'})[name.split('.').pop()]||'application/octet-stream');res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Runway Rumble listening on port '+(process.env.PORT||3000)));

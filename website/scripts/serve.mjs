import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { output } from './build.mjs';
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.png':'image/png', '.jpeg':'image/jpeg', '.woff2':'font/woff2', '.txt':'text/plain', '.xml':'application/xml' };
const port = Number(process.env.PORT || 4173);
http.createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(output, '.' + (name.endsWith('/') ? name + 'index.html' : name));
    if (!target.startsWith(output + path.sep)) { res.writeHead(403).end(); return; }
    const content = await readFile(target);
    res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(content);
  } catch { res.writeHead(404, { 'Content-Type':'text/plain' }).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const input = process.argv[2];
if (!input) throw new Error('Usage: npm run set-url -- https://your-domain.example');
const next = new URL(input);
if (next.protocol !== 'https:' || next.pathname !== '/' || next.search || next.hash) throw new Error('Use an HTTPS origin without a path, query, or fragment.');
const config = JSON.parse(await readFile(path.join(root,'site.config.json')));
const old = config.url;
config.url = next.origin;
const files = ['index.html','robots.txt','sitemap.xml','llms.txt','../README.md','../.github/CONTRIBUTING.md','../.github/ISSUE_TEMPLATE/config.yml','docs/DEVELOPMENT.md','docs/wiki/_Footer.md','docs/wiki/Home.md','docs/wiki/Self-Hosting.md'];
for (const file of files) {
  const target = path.join(root,file);
  await writeFile(target,(await readFile(target,'utf8')).replaceAll(old,next.origin));
}
await writeFile(path.join(root,'site.config.json'),JSON.stringify(config,null,2)+'\n');
// The JSON-LD CSP hash must follow any canonical URL change.
const html = await readFile(path.join(root,'index.html'),'utf8');
const jsonld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
const { createHash } = await import('node:crypto');
const hash = createHash('sha256').update(jsonld).digest('base64');
const vercelPath = path.join(root,'vercel.json');
await writeFile(vercelPath,(await readFile(vercelPath,'utf8')).replace(/sha256-[A-Za-z0-9+/=]+/,`sha256-${hash}`));
console.log(`Site URL updated to ${next.origin}. Run npm run check && npm run build.`);

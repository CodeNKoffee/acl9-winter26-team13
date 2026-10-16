import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const repository=path.resolve(root,'..');
const read=file=>readFile(path.join(root,file),'utf8');
const readRepo=file=>readFile(path.join(repository,file),'utf8');
const existsRepo=async file=>{try{await stat(path.join(repository,file));return true;}catch{return false;}};
const exists=async file=>{try{await stat(path.join(root,file));return true;}catch{return false;}};
const html=await read('index.html');
const pkg=JSON.parse(await read('package.json'));
const config=JSON.parse(await read('site.config.json'));
const vercel=JSON.parse(await readRepo('vercel.json'));
const manifest=JSON.parse(await read('manifest.webmanifest'));
const lock=JSON.parse(await read('package-lock.json'));
const ld=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
const schema=JSON.parse(ld);
assert.equal(pkg.version,config.version);
assert.equal(lock.version,pkg.version);
assert.equal(lock.packages[''].version,pkg.version);
assert((await read('assets/config.js')).includes(`version: '${pkg.version}'`));
assert((await read('docs/CHANGELOG.md')).includes(`## [${pkg.version}] - 2026-10-17`));
assert.equal(schema.url,config.url+'/');
assert.equal(schema.about.codeRepository,config.repository);
const hash=createHash('sha256').update(ld).digest('base64');
const csp=vercel.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
assert(csp.includes(`'sha256-${hash}'`),'JSON-LD CSP hash does not match');
assert(csp.includes("connect-src 'self'"));
assert(csp.includes('frame-src https://drive.google.com'));
assert(!csp.includes("'unsafe-inline'"));
assert.equal(vercel.outputDirectory,'website/dist');
assert.equal(vercel.installCommand,'npm --prefix website ci');
assert.equal(vercel.buildCommand,'npm --prefix website run build');
assert(html.includes(`<link rel="canonical" href="${config.url}/">`));
assert((await read('robots.txt')).includes(config.url+'/sitemap.xml'));
assert((await read('sitemap.xml')).includes('<loc>'+config.url+'/</loc>'));
for(const icon of manifest.icons)assert(await exists(icon.src),`Missing icon ${icon.src}`);
for(const screenshot of manifest.screenshots)assert(await exists(screenshot.src));
for(const image of ['og.png','docs/readme/banner-light.png','docs/readme/banner-dark.png']){
  const buffer=await readFile(path.join(root,image));
  assert.equal(buffer.readUInt32BE(16),1280,`${image}: width`);
  assert.equal(buffer.readUInt32BE(20),640,`${image}: height`);
}
assert((await stat(path.join(root,'docs/readme/lights-out.gif'))).size<1048576);
for(const match of html.matchAll(/(?:src|href|data-src)="([^"<>]+)"/g)){
  const href=match[1];
  if(href.startsWith('#')) {assert(html.includes(`id="${href.slice(1)}"`),`Missing HTML target ${href}`);continue;}
  if(/^(https?:|data:)/.test(href))continue;
  assert(await exists(href.split('#')[0]),`Missing HTML asset ${href}`);
}
const markdown=[];
async function walk(directory){for(const entry of await readdir(path.join(repository,directory),{withFileTypes:true})){
  if(['.git','node_modules','dist'].includes(entry.name))continue;
  const file=path.join(directory,entry.name);
  if(entry.isDirectory())await walk(file);else if(file.endsWith('.md'))markdown.push(file);
}}
await walk('');
const slug=text=>text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/ /g,'-');
for(const file of markdown){
  const text=await readRepo(file);
  const anchors=[...text.matchAll(/^#{1,6}\s+(.+)$/gm)].map(m=>slug(m[1]));
  const links=[...text.matchAll(/\]\(([^)]+)\)/g),...text.matchAll(/(?:src|srcset|href)="([^"<>]+)"/g)];
  for(const m of links){
    const href=m[1];if(/^(https?:|mailto:|data:)/.test(href))continue;
    if(href.startsWith('#')){assert(anchors.includes(href.slice(1)),`${file}: missing anchor ${href}`);continue;}
    const [target,fragment]=decodeURIComponent(href).split('#');
    const resolved=path.normalize(path.join(path.dirname(file),target));
    assert(await existsRepo(resolved),`${file}: missing local link ${href}`);
    if(fragment&&resolved.endsWith('.md'))assert([...((await readRepo(resolved)).matchAll(/^#{1,6}\s+(.+)$/gm))].some(m=>slug(m[1])===fragment),`${file}: missing anchor in ${href}`);
  }
}
const wiki=await readdir(path.join(root,'docs/wiki'));
for(const file of wiki){
  const text=await read('docs/wiki/'+file);
  for(const [,name] of text.matchAll(/\[\[([^\]]+)\]\]/g))assert(wiki.includes(name.replaceAll(' ','-')+'.md'),`Broken wiki link ${name}`);
}
assert(!/```mermaid/.test(await readRepo('README.md')));
assert((await read('project-link.txt')).includes('https://drive.google.com/file/d/1DqSlh85tX_Q4ai2vMS4IBDJC6TlLHCPO/view?usp=sharing'));
// YAML is a deliberately narrow, static structure here. Require every contact block to have a valid HTTPS URL.
const issueConfig=await readRepo('.github/ISSUE_TEMPLATE/config.yml');
assert(issueConfig.startsWith('blank_issues_enabled: false\ncontact_links:\n'));
const contactBlocks=issueConfig.split('  - name: ').slice(1);
assert.equal(contactBlocks.length,4);
for(const block of contactBlocks){assert(/^.+\n    url: https:\/\/\S+\n    about: .+\n$/.test(block));new URL(block.match(/url: (.+)/)[1]);}
console.log(`PASS: ${markdown.length} Markdown files, local links and anchors, wiki links, assets, version fields, JSON-LD, production CSP, manifest, image sizes, and archive URL.`);

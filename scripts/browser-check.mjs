import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dependency } from './dependencies.mjs';
import { startPreview } from './preview-helper.mjs';
const { chromium }=dependency('playwright');
const server=await startPreview(4174);
let browser;
try {
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
  const errors=[];
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.setViewportSize({width:1440,height:1000});
  // Match production headers to catch CSP problems before deployment.
  const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url)));
  const headers=Object.fromEntries(config.headers[0].headers.map(h=>[h.key,h.value]));
  await page.route(server.url+'/**',async route=>{
    const response=await route.fetch();
    await route.fulfill({response,headers:{...response.headers(),...headers}});
  });
  await page.goto(server.url);
  await page.locator('#intro.active').waitFor({state:'hidden'});
  assert.match(await page.title(),/ACL9 Apex/);
  assert.equal(await page.locator('h1').innerText(),'DRIVEN\nBY DATA.');
  assert.equal(await page.locator('iframe[src]').count(),0,'Drive must not load before a preview request');
  const drive='https://drive.google.com/file/d/1DqSlh85tX_Q4ai2vMS4IBDJC6TlLHCPO/view?usp=sharing';
  assert.equal(await page.locator('.archive-actions [data-link="drive"]').getAttribute('href'),drive);
  await page.getByRole('button',{name:'Copy Drive link'}).click();
  assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),drive);
  assert.match(await page.locator('#copy-status').innerText(),/copied/);
  // Verify iframe integration without depending on a third-party preview service in the automated run.
  await page.route('https://drive.google.com/**',route=>route.fulfill({contentType:'text/html',body:'<p>Preview integration fixture</p>'}));
  await page.getByRole('button',{name:'Preview archive'}).click();
  assert.equal(await page.locator('iframe').getAttribute('src'),'https://drive.google.com/file/d/1DqSlh85tX_Q4ai2vMS4IBDJC6TlLHCPO/preview');
  assert.equal(await page.locator('#preview-toggle').getAttribute('aria-expanded'),'true');
  await page.getByRole('button',{name:'Close preview'}).click();
  assert.equal(await page.locator('#drive-preview').isVisible(),false);
  const download=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Save link as .txt'}).click()]);
  assert.equal(download[0].suggestedFilename(),'project-link.txt');
  for(const width of [320,375,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow at ${width}px`);
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Open navigation'}).click();
  assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');
  await page.locator('#mobile-nav').getByRole('link',{name:'The crew',exact:true}).click();
  assert.equal(await page.locator('#mobile-nav').isVisible(),false);
  assert.match(page.url(),/#crew$/);
  await page.reload();
  assert.match(page.url(),/#crew$/);
  await page.getByRole('button',{name:'Open navigation'}).click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-nav').isVisible(),false);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(server.url);
  assert.equal(await page.locator('#intro').isVisible(),false,'Respect reduced motion');
  await page.getByRole('button',{name:'Replay intro'}).click();
  assert.equal(await page.locator('#intro').isVisible(),false);
  const noJS=await browser.newContext({javaScriptEnabled:false});
  const staticPage=await noJS.newPage();
  await staticPage.goto(server.url);
  assert.equal(await staticPage.locator('h1').isVisible(),true);
  assert.equal(await staticPage.locator('#intro').isVisible(),false);
  assert.equal(await staticPage.locator('.archive-actions [data-link="drive"]').isVisible(),true);
  assert.equal((await staticPage.request.get(server.url+'/F1%20Project%20Repository.zip')).status(),404,'The ZIP must stay out of website deployment');
  assert.deepEqual(errors,[],'Browser console or runtime errors');
  console.log('PASS: archive links, copy, download, lazy iframe, preview toggle, mobile navigation, Escape, reload, 6 viewport widths, reduced motion, no-JS content, production CSP, and zero console errors.');
} finally { await browser?.close(); server.stop(); }

import { mkdir, writeFile, cp, stat, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { dependency } from './dependencies.mjs';
import { startPreview, root } from './preview-helper.mjs';
const {chromium}=dependency('playwright');
const sharp=dependency('sharp');
const media=path.join(root,'docs/readme');
await mkdir(media,{recursive:true});
for(const size of [192,512])await sharp(path.join(root,'assets/icon.svg')).resize(size,size).png().toFile(path.join(root,`assets/icon-${size}.png`));
// Bootstrap only: these are replaced with screenshots from the actual page below.
for(const name of ['og.png','assets/site-preview.png']){
  try{await stat(path.join(root,name));}catch{await sharp(path.join(root,'assets/icon.svg')).resize(1280,640,{fit:'contain',background:'#d30b23'}).png().toFile(path.join(root,name));}
}
const server=await startPreview(4175);
let browser;
const frames=await mkdtemp(path.join(tmpdir(),'team13-media-'));
try {
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:800},reducedMotion:'reduce'});
  await page.goto(server.url);await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:path.join(media,'hero.png')});
  for(const name of ['project','crew','archive']) {
    await page.locator('#'+name).scrollIntoViewIfNeeded();
    await page.locator('#'+name).screenshot({path:path.join(media,name+'.png')});
  }
  await page.setViewportSize({width:1280,height:640});
  await page.goto(server.url);await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:path.join(media,'banner-light.png')});
  await cp(path.join(media,'banner-light.png'),path.join(root,'og.png'));
  await cp(path.join(media,'banner-light.png'),path.join(root,'assets/site-preview.png'));
  await page.setViewportSize({width:390,height:844});
  await page.goto(server.url);await page.screenshot({path:path.join(media,'mobile.png'),fullPage:true});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1280,height:640});
  await page.goto(server.url);await page.waitForTimeout(650);
  await page.screenshot({path:path.join(media,'banner-dark.png')});
  await page.setViewportSize({width:960,height:600});
  await page.reload();
  for(let i=0;i<32;i++){
    await page.screenshot({path:path.join(frames,`frame-${String(i).padStart(3,'0')}.png`)});
    await page.waitForTimeout(75);
  }
  const gif=path.join(media,'lights-out.gif');
  const result=spawnSync('ffmpeg',['-y','-loglevel','error','-framerate','8','-i',path.join(frames,'frame-%03d.png'),'-vf','scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64[p];[b][p]paletteuse=dither=none','-loop','0',gif],{stdio:'inherit'});
  if(result.status!==0)throw new Error('ffmpeg failed. Install ffmpeg to regenerate the GIF.');
  const optimizer=spawnSync('gifsicle',['-O3','--lossy=60','-b',gif]);
  if(optimizer.error?.code==='ENOENT')console.log('gifsicle unavailable; using the compact ffmpeg output.');
  const bytes=(await stat(gif)).size;
  if(bytes>1048576)throw new Error(`GIF exceeds 1 MiB (${bytes} bytes). Lower palette size or frame count.`);
  await writeFile(path.join(media,'media-info.json'),JSON.stringify({source:'Real app captures from website/scripts/readme-media.mjs',gifBytes:bytes},null,2)+'\n');
  console.log(`Captured website media; intro GIF ${(bytes/1024).toFixed(0)} KiB.`);
} finally { await browser?.close();server.stop();await rm(frames,{recursive:true,force:true}); }

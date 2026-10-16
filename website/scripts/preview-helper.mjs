import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export const root = fileURLToPath(new URL('..', import.meta.url));
export async function startPreview(port) {
  const processHandle = spawn(process.execPath, ['scripts/serve.mjs'], { cwd:root, env:{...process.env,PORT:String(port)}, stdio:['ignore','pipe','pipe'] });
  let output='';
  processHandle.stdout.on('data',data=>{output+=data;});
  processHandle.stderr.on('data',data=>{output+=data;});
  const url=`http://127.0.0.1:${port}`;
  for(let tries=0;tries<100;tries++) {
    if(processHandle.exitCode!==null) throw new Error(output || 'Preview process failed');
    try { const response=await fetch(url); if(response.ok) return {url,stop:()=>processHandle.kill()}; } catch {}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  processHandle.kill();
  throw new Error('Preview did not become ready: '+output);
}

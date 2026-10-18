import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
export const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// An explicit allowlist keeps the original project ZIP and repository docs out of deployment.
for (const file of ['index.html', 'assets', 'project-link.txt', 'manifest.webmanifest', 'og.png', 'robots.txt', 'sitemap.xml', 'llms.txt']) {
  await cp(path.join(root, file), path.join(output, file), { recursive: true });
}
console.log('Built static site in dist/');

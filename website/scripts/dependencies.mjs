import { createRequire } from 'node:module';
// Optional local override lets Codex use its bundled dependencies without committing local paths.
const require = createRequire(import.meta.url);
export function dependency(name) {
  if (process.env.TEAM13_NODE_MODULES) return require(`${process.env.TEAM13_NODE_MODULES}/${name}`);
  return require(name);
}

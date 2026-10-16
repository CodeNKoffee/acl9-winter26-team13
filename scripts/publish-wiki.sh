#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "$0")/.." && pwd)"
wiki_remote="https://github.com/CodeNKoffee/acl9-winter26-apex.wiki.git"
wiki_tmp="$(mktemp -d "${TMPDIR:-/tmp}/acl9-apex-wiki.XXXXXX")"
trap 'rm -rf "$wiki_tmp"' EXIT

if ! git clone "$wiki_remote" "$wiki_tmp/wiki"; then
  echo "GitHub Wiki is not initialized or authentication is unavailable."
  echo "Open the repository Wiki tab, create the first Home page, and retry."
  echo "The full guide remains in docs/wiki/ in the main repository."
  exit 1
fi

cp "$project_root"/docs/wiki/*.md "$wiki_tmp/wiki/"
source_sha="$(git -C "$project_root" rev-parse --short HEAD)"
git -C "$wiki_tmp/wiki" add '*.md'
if git -C "$wiki_tmp/wiki" diff --cached --quiet; then
  echo "Wiki already matches docs/wiki/."
  exit 0
fi
git -C "$wiki_tmp/wiki" -c user.name='Hatem Soliman' -c user.email='hatemthedev@gmail.com' commit -m "Sync wiki from docs/wiki at $source_sha"
git -C "$wiki_tmp/wiki" push origin HEAD

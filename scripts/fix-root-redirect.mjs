// Post-build safety net: if Astro ever emits the root redirect as
// /resumeforgeen/ (base + locale concatenated without a slash), rewrite it
// to the correct /resumeforge/en/ target. Runs as `postbuild`.
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../dist/index.html', import.meta.url);
let html = readFileSync(file, 'utf8');
const fixed = html.replaceAll('/resumeforgeen/', '/resumeforge/en/');
if (fixed !== html) {
  writeFileSync(file, fixed);
  console.log('fix-root-redirect: patched dist/index.html -> /resumeforge/en/');
} else {
  console.log('fix-root-redirect: nothing to patch');
}

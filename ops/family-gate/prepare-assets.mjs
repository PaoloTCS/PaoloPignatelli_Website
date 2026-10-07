import {copyFile, mkdir, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const output = resolve(here, 'private-assets');
const paths = [
  'family-ai.html', 'family-ai.css', 'family-ai.js',
  'family-about.html', 'family-planning.html', 'family-planning.css', 'family-planning.js',
  'history-connection.js', 'images/pignatelli-coat-of-arms.png',
  'family-agent-service/relationships.js', 'family-agent-service/relationship-widget.js',
  'family-agent-service/relationship-widget.css', 'data/branches/collegio-araldico-pignatelli.json'
];
await rm(output, {recursive: true, force: true});
for (const path of paths) {
  const target = resolve(output, path);
  await mkdir(dirname(target), {recursive: true});
  await copyFile(resolve(root, path), target);
}
console.log(`Prepared ${paths.length} family assets; no server code or credentials included.`);

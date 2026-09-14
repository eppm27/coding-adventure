import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
const root = resolve(import.meta.dirname, '..');
const production = [...readdirSync(root).filter(f => f.endsWith('.html')), 'style.css','favicon.svg',...readdirSync(join(root,'scripts')).filter(f => f.endsWith('.js')).map(f => `scripts/${f}`)];
let references = 0;
for (const file of production) {
  const content = readFileSync(join(root,file),'utf8');
  if (/\/Users\/|[A-Z]:\\Users\\/.test(content)) throw Error(`Machine-specific path in ${file}`);
  if (file.endsWith('.js')) execFileSync(process.execPath,['--check',join(root,file)]);
  for (const match of content.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^(https?:|#)/.test(target)) continue;
    if (!existsSync(resolve(root,file.endsWith('.js') ? '' : dirname(file),target.replace(/^\//, '')))) throw Error(`Missing asset ${target} in ${file}`);
    references++;
  }
  if (file.endsWith('.css')) for (const match of content.matchAll(/url\(['"]?([^)'"]+)/g)) {
    if (!existsSync(resolve(root,match[1]))) throw Error(`Missing CSS asset ${match[1]}`);
    references++;
  }
  for (const match of content.matchAll(/from ['"](\.\/[^'"]+)['"]/g)) {
    if (!existsSync(resolve(root,dirname(file),match[1]))) throw Error(`Missing module ${match[1]} in ${file}`);
  }
}
console.log(`Checked ${production.length} production/source files, JavaScript syntax, module imports, and ${references} local references.`);

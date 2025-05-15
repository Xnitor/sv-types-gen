#!/usr/bin/env node
const fs   = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const svTypesRoot = path.join(projectRoot, 'node_modules', '@sitevision', 'api', 'types');

if (!fs.existsSync(svTypesRoot)) {
  console.warn('⚠️  No @sitevision/api/types found – skipping type-barrel generation');
  process.exit(0);
}

// Och utfilen ligger i user‐projektet under src/types
const outFile     = path.join(projectRoot, 'src', 'types', 'sitevision-api.d.ts');

// Hjälpfunktion: rekursivt hitta alla kataloger med index.d.ts
function walkTypes(dir, rel = []) {
  let found = [];
  for (let ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full   = path.join(dir, ent.name);
    const newRel = rel.concat(ent.name);
    if (ent.isDirectory()) {
      // om katalogen har en index.d.ts → exportera den modul-vägen
      if (fs.existsSync(path.join(full, 'index.d.ts'))) {
        found.push(newRel.join('/'));
      }
      found = found.concat(walkTypes(full, newRel));
    }
  }
  return found;
}

// 3) hämta alla typ-moduler
const typeModules = walkTypes(svTypesRoot);

// 4) bygg innehållet i barrel-filen
const lines = [
  '// AUTO-GENERATED — bara typer, do not edit',
  'declare module "sitevision-api" {',
  ...typeModules.map(m =>
    `  export * from "@sitevision/api/types/${m}";`
  ),
  '}\n'
];

// 5) skriv ut filen
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
console.log(`✅ sitevision-api.d.ts (only types): ${typeModules.length} exports`);
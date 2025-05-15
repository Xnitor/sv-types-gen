#!/usr/bin/env node
// scripts/gen-sv-types-only.js

const fs   = require('fs');
const path = require('path');

// 1) var ditt Sitevision-paket bor
const svTypesRoot = path.resolve(__dirname, '../node_modules/@sitevision/api/types');
// 2) var du vill lägga din auto-generated barrel
const outFile     = path.resolve(__dirname, '../src/types/sitevision-api.d.ts');

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
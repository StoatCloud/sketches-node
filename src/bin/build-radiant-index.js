#!/usr/bin/env node

/**
 * Extract Radiant shader metadata from the radiant submodule and write JSON
 * for the site gallery (iframe previews). Keeps tags/technique in sync with
 * radiant/src/lib/shaders.ts.
 */

const fs = require('fs');
const path = require('path');

const shadersTs = path.join(__dirname, '..', '..', 'radiant', 'src', 'lib', 'shaders.ts');
const outJson = path.join(__dirname, '..', 'src', 'sketches', 'radiant-shaders.json');

if (!fs.existsSync(shadersTs)) {
  process.stderr.write(
    'Radiant submodule missing. Run: git submodule update --init --recursive\n'
  );
  process.exit(1);
}

const src = fs.readFileSync(shadersTs, 'utf8');
const marker = 'export const shaders: Shader[] = ';
const endMarker = '\n];\n\nexport function getShaderById';
const start = src.indexOf(marker);
if (start === -1) {
  throw new Error('Could not find shaders export in radiant/src/lib/shaders.ts');
}
const end = src.indexOf(endMarker, start);
if (end === -1) {
  throw new Error('Could not find end of shaders array');
}

const arrayLiteral = src.slice(start + marker.length, end + 3).trim();

let shaders;
try {
  shaders = new Function('"use strict"; return ' + arrayLiteral)();
} catch (e) {
  throw new Error('Failed to parse shaders array: ' + e.message);
}

if (!Array.isArray(shaders)) {
  throw new Error('Expected shaders to be an array');
}

const slim = shaders.map(function (s) {
  return {
    id: s.id,
    file: s.file,
    title: s.title,
    desc: s.desc,
    tags: s.tags,
    technique: s.technique,
    defaultScheme: s.defaultScheme || null
  };
});

fs.writeFileSync(outJson, JSON.stringify(slim, null, 0) + '\n');
process.stderr.write('Wrote ' + slim.length + ' Radiant shaders to ' + outJson + '\n');

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

// 1. Fix Hoisting
const files = globSync('frontend/src/pages/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Convert async const arrow functions to async function declarations
  content = content.replace(/const (\w+) = async \((.*?)\)(?:: [^{=]+)? => \{/g, 'async function $1($2) {');
  
  // Convert standard const arrow functions to function declarations
  content = content.replace(/const (\w+) = \((.*?)\)(?:: [^{=]+)? => \{/g, 'function $1($2) {');

  // Note: we might accidentally convert some arrow functions inside expressions if they match,
  // but usually component functions and handlers are defined at the top level of the component block.
  // Let's make the regex a bit safer by ensuring it's at the start of a line (with optional spaces).
  
  if (original !== content) {
    fs.writeFileSync(file, content);
    console.log('Fixed hoisting in', file);
  }
});

// Re-do with safer regex just in case
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Safe replace: only lines starting with spaces followed by `const`
  content = content.replace(/^(\s*)const (\w+) = async \((.*?)\)(?:: [^{=]+)? => \{/gm, '$1async function $2($3) {');
  content = content.replace(/^(\s*)const (\w+) = \((.*?)\)(?:: [^{=]+)? => \{/gm, '$1function $2($3) {');
  
  if (original !== content) {
    fs.writeFileSync(file, content);
    console.log('Fixed hoisting (safe mode) in', file);
  }
});

const fs = require('fs');
let sql = fs.readFileSync('init.sql', 'utf8');

// Split by statements roughly. A statement ends with ;
let statements = sql.split(';');

let finalStatements = [];

for (let s of statements) {
  let trimmed = s.trim();
  if (!trimmed) continue;
  
  // Skip CREATE TABLE "auth".*
  if (trimmed.startsWith('CREATE TABLE "auth"')) continue;
  
  // Skip CREATE TYPE "auth".*
  if (trimmed.startsWith('CREATE TYPE "auth"')) continue;
  
  // Skip ALTER TABLE "auth".*
  if (trimmed.startsWith('ALTER TABLE "auth"')) continue;
  
  // Skip CREATE UNIQUE INDEX ... ON "auth".*
  if (trimmed.match(/CREATE UNIQUE INDEX .* ON "auth"/)) continue;
  if (trimmed.match(/CREATE INDEX .* ON "auth"/)) continue;

  // Skip CREATE SCHEMA "auth"
  if (trimmed.includes('CREATE SCHEMA IF NOT EXISTS "auth"')) continue;
  if (trimmed.includes('CREATE SCHEMA "auth"')) continue;

  finalStatements.push(s);
}

fs.writeFileSync('init-public.sql', finalStatements.join(';') + ';');
console.log('Filtered ' + statements.length + ' statements into ' + finalStatements.length + ' statements.');

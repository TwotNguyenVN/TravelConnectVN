import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (f.endsWith('.ts') || f.endsWith('.tsx')) {
        callback(dirPath);
      }
    }
  });
}

let totalReplacements = 0;

walkDir(path.join(process.cwd(), 'frontend', 'src'), (filePath) => {
  // Do not revert api.types.ts and api.ts
  if (filePath.endsWith('api.types.ts') || filePath.endsWith('api.ts')) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Reverse the replacements
  content = content.replace(/as unknown as Record<string, unknown>/g, 'as any');
  content = content.replace(/as unknown/g, 'as any');
  content = content.replace(/unknown \| null/g, 'any | null');
  content = content.replace(/\[unknown, unknown\]/g, '[any, any]');
  content = content.replace(/\[unknown, unknown, unknown, unknown\]/g, '[any, any, any, any]');
  content = content.replace(/<Record<string, unknown>>/g, '<Record<string, any>>');
  content = content.replace(/Record<string, unknown>/g, 'any');
  content = content.replace(/\[key: string\]: unknown/g, '[key: string]: any');
  content = content.replace(/:\s*unknown/g, ': any');
  content = content.replace(/<unknown>/g, '<any>');
  content = content.replace(/<unknown\[\]>/g, '<any[]>');
  content = content.replace(/unknown\[\]/g, 'any[]');
  content = content.replace(/\(s: unknown\)/g, '(s: any)');
  content = content.replace(/\(req: unknown\)/g, '(req: any)');
  content = content.replace(/\(item: unknown\)/g, '(item: any)');
  content = content.replace(/error: unknown/g, 'error: any');
  content = content.replace(/err: unknown/g, 'err: any');
  content = content.replace(/res: unknown/g, 'res: any');
  content = content.replace(/response: unknown/g, 'response: any');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalReplacements++;
    console.log(`Reverted in ${filePath}`);
  }
});

console.log(`Total files updated: ${totalReplacements}`);

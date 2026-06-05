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
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  content = content.replace(/as any/g, 'as unknown');
  content = content.replace(/any \| null/g, 'unknown | null');
  content = content.replace(/\[any, any\]/g, '[unknown, unknown]');
  content = content.replace(/\[any, any, any, any\]/g, '[unknown, unknown, unknown, unknown]');
  content = content.replace(/<Record<string, any>>/g, '<Record<string, unknown>>');
  content = content.replace(/\[key: string\]: any/g, '[key: string]: unknown');
  content = content.replace(/\(s as any\)/g, '(s as unknown as Record<string, unknown>)');
  content = content.replace(/\(a as any\)/g, '(a as unknown as Record<string, unknown>)');
  content = content.replace(/\(b as any\)/g, '(b as unknown as Record<string, unknown>)');
  content = content.replace(/\(futureSchedules\[0\] as any\)/g, '(futureSchedules[0] as unknown as Record<string, unknown>)');
  content = content.replace(/\(log as any\)/g, '(log as Record<string, unknown>)');
  content = content.replace(/\(profile as any\)/g, '(profile as Record<string, unknown>)');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalReplacements++;
    console.log(`Updated ${filePath}`);
  }
});

console.log(`Total files updated: ${totalReplacements}`);

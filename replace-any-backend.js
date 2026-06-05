import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (f.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

let totalReplacements = 0;

walkDir(path.join(process.cwd(), 'backend', 'src'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Function argument types: params: any, data: any, req: any, body: any
  content = content.replace(/params\s*:\s*any(\s*[=>),;])/g, 'params: Record<string, unknown>$1');
  content = content.replace(/data\s*:\s*any(\s*[=>),;])/g, 'data: Record<string, unknown>$1');
  content = content.replace(/req\s*:\s*any(\s*[=>),;])/g, 'req: Record<string, unknown>$1');
  content = content.replace(/body\s*:\s*any(\s*[=>),;])/g, 'body: Record<string, unknown>$1');
  content = content.replace(/query\s*:\s*any(\s*[=>),;])/g, 'query: Record<string, unknown>$1');
  content = content.replace(/context\s*:\s*any(\s*[=>),;])/g, 'context: Record<string, unknown>$1');
  content = content.replace(/file\s*:\s*any(\s*[=>),;])/g, 'file: Record<string, unknown>$1');

  // Error catch blocks
  content = content.replace(/error\s*:\s*any(\s*[=>),;])/g, 'error: unknown$1');
  content = content.replace(/err\s*:\s*any(\s*[=>),;])/g, 'err: unknown$1');

  // Returns/Promises
  content = content.replace(/ApiResponse<any>/g, 'ApiResponse<unknown>');
  content = content.replace(/Promise<any>/g, 'Promise<unknown>');

  // Object typing let where: any = {}
  content = content.replace(/:\s*any\s*=\s*{}/g, ': Record<string, unknown> = {}');
  content = content.replace(/where:\s*any\s*=/g, 'where: Record<string, unknown> =');

  // Arrays
  content = content.replace(/any\[\]/g, 'unknown[]');

  // Type casts (as any)
  content = content.replace(/as any/g, 'as unknown');
  content = content.replace(/<any>/g, '<unknown>');
  
  // Generic Catch-all
  content = content.replace(/(:\s*)any(\s*[=>),;])/g, '$1unknown$2');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalReplacements++;
    console.log(`Updated ${filePath}`);
  }
});

console.log(`Total files updated: ${totalReplacements}`);

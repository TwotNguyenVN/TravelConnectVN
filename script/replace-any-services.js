import fs from 'fs';
import path from 'path';

const servicesDir = path.join(process.cwd(), 'frontend', 'src', 'services');

const files = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts'));

let totalReplacements = 0;

files.forEach(file => {
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Replace params: any -> params: Record<string, unknown>
  content = content.replace(/params\s*:\s*any/g, 'params: Record<string, unknown>');
  
  // Replace data: any -> data: Record<string, unknown>
  content = content.replace(/data\s*:\s*any/g, 'data: Record<string, unknown>');

  // Replace err: any or error: any -> err: unknown
  content = content.replace(/err\s*:\s*any/g, 'err: unknown');
  content = content.replace(/error\s*:\s*any/g, 'error: unknown');

  // Replace any[] -> unknown[]
  content = content.replace(/any\[\]/g, 'unknown[]');

  // Replace Promise<ApiResponse<any>> -> Promise<ApiResponse<unknown>>
  content = content.replace(/ApiResponse<any>/g, 'ApiResponse<unknown>');

  // Replace any generic leftover like : any => : unknown
  // but be careful not to replace company or many
  content = content.replace(/(:\s*)any(\s*[=>),;])/g, '$1unknown$2');

  // Replace <any> -> <unknown>
  content = content.replace(/<any>/g, '<unknown>');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalReplacements++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Total files updated: ${totalReplacements}`);

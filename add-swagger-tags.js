const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (file.endsWith('.controller.ts')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const controllers = walk(path.join(__dirname, 'backend/src'));

let modifiedCount = 0;

for (const file of controllers) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Check if it already has @ApiTags
  if (content.includes('@ApiTags')) continue;

  // Find the class name to use as tag
  const classRegex = /export\s+class\s+([A-Za-z0-9_]+)Controller/i;
  const match = content.match(classRegex);
  if (!match) continue;
  
  let tagName = match[1];
  // Format tag name e.g. SystemSettings -> System Settings
  tagName = tagName.replace(/([A-Z])/g, ' $1').trim();

  // Add import if not exists
  if (!content.includes('from \'@nestjs/swagger\'') && !content.includes('from "@nestjs/swagger"')) {
    // Insert at the beginning of the file, after any eslint disable comments
    const lines = content.split('\n');
    let insertIndex = 0;
    while (lines[insertIndex] && lines[insertIndex].startsWith('/*')) {
      insertIndex++;
    }
    lines.splice(insertIndex, 0, "import { ApiTags } from '@nestjs/swagger';");
    content = lines.join('\n');
  } else {
    // Make sure ApiTags is imported
    if (!content.includes('ApiTags')) {
       content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]@nestjs\/swagger['"];/, "import { $1, ApiTags } from '@nestjs/swagger';");
    }
  }

  // Add @ApiTags above @Controller
  const controllerDecoratorRegex = /@Controller\(['"][^'"]*['"]\)/;
  content = content.replace(controllerDecoratorRegex, `@ApiTags('${tagName}')\n$&`);

  fs.writeFileSync(file, content, 'utf-8');
  modifiedCount++;
}

console.log(`Added @ApiTags to ${modifiedCount} controllers.`);

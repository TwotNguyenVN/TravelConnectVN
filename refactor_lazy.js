const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/routes/index.tsx');
let code = fs.readFileSync(filePath, 'utf-8');

// Ensure React, lazy, Suspense are imported
if (!code.includes('import { lazy, Suspense } from \'react\';')) {
  code = `import { lazy, Suspense } from 'react';\n` + code;
}

// Helper to convert imports
// Match: import { Page } from '../pages/path';
// Match: import Page from '../pages/path';
const importRegex = /^import\s+(?:{\s*([a-zA-Z0-9_]+)\s*}|([a-zA-Z0-9_]+))\s+from\s+['"]\.\.\/(pages|layouts)\/([^'"]+)['"];$/gm;

let match;
const replacements = [];

while ((match = importRegex.exec(code)) !== null) {
  const fullMatch = match[0];
  const namedExport = match[1];
  const defaultExport = match[2];
  const folder = match[3];
  const relativePath = match[4];
  const componentName = namedExport || defaultExport;

  // We don't lazy load PublicLayout, HomePage, LoginPage, RegisterPage, TourListPage to keep initial load fast
  const keepStatic = ['PublicLayout', 'HomePage', 'LoginPage', 'RegisterPage', 'TourListPage', 'TourDetailPage', 'RoleSelectionPage', 'AuthGuard', 'RoleGuard', 'MaintenancePage'];
  
  if (keepStatic.includes(componentName)) {
    continue;
  }

  let lazyStatement = '';
  if (namedExport) {
    lazyStatement = `const ${componentName} = lazy(() => import('../${folder}/${relativePath}').then(m => ({ default: m.${componentName} })));`;
  } else {
    lazyStatement = `const ${componentName} = lazy(() => import('../${folder}/${relativePath}'));`;
  }

  replacements.push({
    original: fullMatch,
    lazy: lazyStatement
  });
}

for (const r of replacements) {
  code = code.replace(r.original, r.lazy);
}

// Wrap layouts with Suspense
const suspenseWrapper = (elementCode) => `<Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="text-xl font-semibold text-gray-500">Loading...</div></div>}>${elementCode}</Suspense>`;

// We need to wrap <UserLayout />, <GuideLayout />, <AdminLayout />, <ContentLayout />, <SupportLayout />, <FinanceLayout />
const layoutsToWrap = ['UserLayout', 'GuideLayout', 'AdminLayout', 'ContentLayout', 'SupportLayout', 'FinanceLayout'];

for (const layout of layoutsToWrap) {
  const layoutRegex = new RegExp(`(<${layout}\\s*\\/?>)`, 'g');
  code = code.replace(layoutRegex, suspenseWrapper(`$1`));
}

fs.writeFileSync(filePath, code, 'utf-8');
console.log(`Refactored ${replacements.length} imports to lazy loading.`);

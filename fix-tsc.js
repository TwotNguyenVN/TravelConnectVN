import fs from 'fs';
import path from 'path';

const filesToFix = [
  'frontend/src/pages/user/CompanionRequestManagementPage.tsx',
  'frontend/src/pages/user/FavoritesPage.tsx',
  'frontend/src/pages/user/MyCompanionPostsPage.tsx',
  'frontend/src/pages/user/NotificationsPage.tsx',
  'frontend/src/pages/user/ProfilePage.tsx',
  'frontend/src/services/notificationService.ts'
];

filesToFix.forEach(file => {
  const absolutePath = path.resolve(file);
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  // Replace `unknown` back to `any` to quickly fix TS build issues caused by the blind replace script
  content = content.replace(/<unknown>/g, '<any>');
  content = content.replace(/<unknown\[\]>/g, '<any[]>');
  content = content.replace(/\(s: unknown\)/g, '(s: any)');
  content = content.replace(/\(req: unknown\)/g, '(req: any)');
  content = content.replace(/error: unknown/g, 'error: any');
  content = content.replace(/err: unknown/g, 'err: any');
  content = content.replace(/res: unknown/g, 'res: any');
  content = content.replace(/response: unknown/g, 'response: any');
  content = content.replace(/Record<string, unknown>/g, 'any');
  content = content.replace(/as unknown/g, 'as any');
  
  fs.writeFileSync(absolutePath, content);
  console.log(`Reverted unknown to any in ${file}`);
});

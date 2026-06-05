import fs from 'fs';
import path from 'path';

const filesToFix = [
  'frontend/src/pages/guide/GuideDashboardPage.tsx',
  'frontend/src/pages/guide/GuideIncomePage.tsx',
  'frontend/src/pages/guide/TourImagesPage.tsx',
  'frontend/src/pages/guide/TourItineraryPage.tsx',
  'frontend/src/pages/guide/tabs/TourReviewsTab.tsx',
  'frontend/src/pages/public/onboarding/OnboardingPage.tsx',
  'frontend/src/pages/user/CompanionFormPage.tsx',
  'frontend/src/pages/user/ProfilePage.tsx',
  'frontend/src/pages/guide/ActiveTourPage.tsx',
  'frontend/src/pages/guide/TourFormPage.tsx',
  'frontend/src/pages/chat/ChatPage.tsx'
];

filesToFix.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let original = content;

  // We want to move async functions above useEffects.
  // Instead of a complex AST, let's just move ALL `useEffect` blocks to right before the first `return (` statement!
  // Wait, `useEffect` cannot be moved below early returns (e.g. `if (loading) return <Loading/>`).
  // So we must move `useEffect` blocks down, but ABOVE any `return` or `if (...) return`.
  
  // A simpler way is to move the function definitions UP.
  // We can extract `async function fetch...() { ... };` and put them right after the `useState` declarations.
  
  // Regex to match the function:
  // `async function fetchData() { ... };`
  // It matches opening brace, then we need to balance braces to find the end.
  function extractFunction(name) {
    const startRegex = new RegExp(`(?:async )?function ${name}\\(.*?\\) \\{`);
    const match = content.match(startRegex);
    if (!match) return null;
    
    let startIndex = match.index;
    let braceCount = 0;
    let endIndex = -1;
    let inString = false;
    let stringChar = null;
    
    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];
      if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && content[i-1] !== '\\') {
        inString = false;
      } else if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i;
            break;
          }
        }
      }
    }
    
    if (endIndex !== -1) {
      // also grab the trailing `;` if any
      if (content[endIndex + 1] === ';') endIndex++;
      
      const funcBody = content.substring(startIndex, endIndex + 1);
      // Remove from content
      content = content.slice(0, startIndex) + content.slice(endIndex + 1);
      return funcBody;
    }
    return null;
  }
  
  const funcsToMove = [
    'fetchData', 'fetchAllData', 'calculateStats', 'fetchImages', 'fetchItinerary', 
    'fetchReviews', 'fetchGuideMasterData', 'fetchDetail', 'fetchInitialData', 
    'fetchTourDetail', 'fetchConversations', 'fetchMessages', 'scrollToBottom'
  ];
  
  let extractedFuncs = [];
  for (const fn of funcsToMove) {
    const code = extractFunction(fn);
    if (code) extractedFuncs.push(code);
  }
  
  if (extractedFuncs.length > 0) {
    // Insert them right after the last `useState` or `useRef` or `useNavigate`
    // We'll look for the first `useEffect` and insert right before it!
    const useEffectMatch = content.match(/\n\s*useEffect\(/);
    if (useEffectMatch) {
      const insertIndex = useEffectMatch.index;
      content = content.slice(0, insertIndex) + '\n\n' + extractedFuncs.join('\n\n') + content.slice(insertIndex);
    } else {
      // if no useEffect, just ignore
    }
    
    fs.writeFileSync(fullPath, content);
    console.log('Fixed function order in', filePath);
  }
});

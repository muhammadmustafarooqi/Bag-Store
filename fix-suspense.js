const fs = require('fs');
const path = require('path');

const filesToFix = [
  'apps/frontend/src/app/auth/reset-password/page.tsx',
  'apps/frontend/src/app/auth/login/page.tsx',
  'apps/frontend/src/app/shop/page.tsx'
];

filesToFix.forEach(filePath => {
  const absolutePath = path.resolve(__dirname, filePath);
  if (!fs.existsSync(absolutePath)) {
    console.log(`File not found: ${absolutePath}`);
    return;
  }
  
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  // Add Suspense import if not exists
  if (!content.includes('import { Suspense } from \'react\'') && !content.includes('Suspense,') && !content.includes(', Suspense')) {
    if (content.includes('import { useState')) {
      content = content.replace('import { useState', 'import { Suspense, useState');
    } else if (content.includes('import { useEffect')) {
      content = content.replace('import { useEffect', 'import { Suspense, useEffect');
    } else {
      content = `import { Suspense } from 'react';\n` + content;
    }
  }

  // Find the export default function
  const exportRegex = /export default function (\w+)\s*\(([^)]*)\)\s*\{/;
  const match = content.match(exportRegex);
  
  if (match) {
    const originalFunctionName = match[1];
    const props = match[2];
    const newFunctionName = originalFunctionName + 'Content';
    
    // Replace export default function with function
    content = content.replace(exportRegex, `function ${newFunctionName}(${props}) {`);
    
    // Append the Suspense wrapper at the end of the file
    content += `\n\nexport default function ${originalFunctionName}(${props}) {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading...</div>}>
      <${newFunctionName} />
    </Suspense>
  );
}\n`;
    
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
  } else {
    console.log(`Could not find export default in ${filePath}`);
  }
});

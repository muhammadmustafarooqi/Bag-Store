const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('apps/backend/src', function(filePath) {
  if (filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check which models are used in the file
    const models = ['User', 'Product', 'Category', 'Order', 'Coupon', 'Banner'];
    let usedModels = [];
    models.forEach(m => {
        // match word boundaries
        const regex = new RegExp(`\\b${m}\\b`);
        if (regex.test(content)) {
            usedModels.push(m);
        }
    });

    if (usedModels.length > 0) {
        // Replace empty require or old requires with the correct one
        if (content.includes("const {  } = require('@kaarvan/db');")) {
            content = content.replace(
                "const {  } = require('@kaarvan/db');",
                `const { ${usedModels.join(', ')} } = require('@kaarvan/db');`
            );
            fs.writeFileSync(filePath, content);
        }
    }
  }
});

// fix-mdx-syntax.js
const fs = require('fs');
const path = require('path');

const directory = './mapping'; // update as needed

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace empty {} with escaped \{\}
  content = content.replace(/(^|[^\\])\{\}/g, '$1\\{\\}');

  // Remove unclosed { expressions (very basic, may need more logic)
  content = content.replace(/\{[^}]*$/gm, '');

  // Remove lone { or }
  content = content.replace(/(^|\s)\{($|\s)/g, '');
  content = content.replace(/(^|\s)\}($|\s)/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${filePath}`);
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.md')) {
      processFile(fullPath);
    }
  });
}

walk(directory);

const fs = require('fs');
const path = require('path');

function walkDir(dir, fileList = [], basePath = dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // ❌ Skip node_modules and hidden directories like .git
      if (file === 'node_modules' || file.startsWith('.')) return;
      walkDir(fullPath, fileList, basePath);
    } else {
      fileList.push(path.relative(basePath, fullPath));
    }
  });

  return fileList;
}

const baseDirectory = path.resolve(__dirname);
const allFiles = walkDir(baseDirectory);

console.log('📁 Project File Map (excluding node_modules):\n');
allFiles.forEach((file, index) => {
  console.log(`${index + 1}. ${file}`);
});

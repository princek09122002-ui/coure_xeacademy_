const fs = require('fs');
const glob = require('glob');

glob('./components/**/*.tsx', (err, files) => {
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/@\/app\/page/g, '@/types');
    fs.writeFileSync(file, content);
  });
});

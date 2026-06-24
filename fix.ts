import * as fs from 'fs';
import * as path from 'path';

function walkSync(dir: string, filelist: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
}

const files = walkSync('./components');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('@/app/page')) {
    fs.writeFileSync(file, content.replace(/@\/app\/page/g, '@/types'));
  }
}

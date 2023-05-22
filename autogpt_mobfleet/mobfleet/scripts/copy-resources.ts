
import * as shell from 'shelljs';
import * as fs from 'fs';
import * as path from 'path';
const { name, version } = require('../package.json');



const out = path.join(__dirname, '..', 'dist');
createFolderIfNotExist(out);

createFolderIfNotExist(path.join(out, 'config'));
createFolderIfNotExist(path.join(out, 'html-template', 'damages/'));
createFolderIfNotExist(path.join(out, 'html-template', 'emails/'));
createFolderIfNotExist(path.join(out, 'firebase-service-account-files'));

shell.cp('-R', 'src/config/*.yml', path.join(out, 'config'));
shell.cp('-R', 'html-template/damages/report-template.html', path.join(out, 'html-template', 'damages/'));
shell.cp('-R', 'html-template/emails/*', path.join(out, 'html-template', 'emails/'));
shell.cp('-R', 'firebase-service-account-files/*.json', path.join(out, 'firebase-service-account-files'));
shell.cp('-R', 'src/i18n', path.join(out, 'i18n'));
shell.cp('ecosystem.config.js', path.join(out, 'ecosystem.config.js'));
fs.writeFileSync(path.join(out, 'package.json'), JSON.stringify({ name, version }));

if (process.argv?.[2] === '--local') {
  console.log("========================== COPY .env =====================================");
  shell.cp('.env', path.join(out, '.env'));
  shell.sed('-i', `exec_interpreter: '/home/ubuntu/.nvm/versions/node/v14.21.2/bin/node'`, '', path.join(out, 'ecosystem.config.js'));
}
let clientDist = path.join(__dirname, '..', '..', 'target', 'classes', 'static');

if (!fs.existsSync(clientDist)) {
  clientDist = path.join(__dirname, '..', '..', 'build', 'resources', 'main', 'static');
}

if (fs.existsSync(clientDist)) {
  shell.cp('-R', clientDist, out);
}

function createFolderIfNotExist(outDir: string): void {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
}

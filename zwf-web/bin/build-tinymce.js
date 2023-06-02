const fse = require('fs-extra');
const path = require('path');
const topDir = __dirname;
fse.emptyDirSync(path.join(topDir, '..', 'public', 'tinymce'));
fse.copySync(
  path.join(topDir, '..', 'node_modules', 'tinymce'),
  path.join(topDir, '..', 'public', 'tinymce'),
  { dereference: true, overwrite: true }
);

fse.copySync(
  path.join(topDir, '..', 'node_modules', '@zwf/img64upload', 'build'),
  path.join(topDir, '..', 'public', 'tinymce', 'plugins', 'img64upload'),
  { dereference: true, overwrite: true }
);
const browserify = require('browserify');
const copydir = require('copy-dir');
const fs = require('fs');
const less = require('less');
const path = require('path');
const tsify = require('tsify');

const srcDir = path.resolve(path.join(__dirname, '../src'));
const destDir = path.resolve(path.join(__dirname, '../dist'));

[destDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});


function staticTask() {
  const htmlFileInput = path.join(srcDir, 'index.html');
  const htmlFileOutput = path.join(destDir, 'index.html');
  fs.createReadStream(htmlFileInput).pipe(fs.createWriteStream(htmlFileOutput));
  const mediaFileInput = path.join(srcDir, 'media');
  copydir.sync(mediaFileInput, destDir);
}


function jsTask() {
  const inputFile = path.join(srcDir, 'js/index.tsx');
  const outputFile = path.join(destDir, 'script.js');
  const tsConfigFile = path.join(srcDir, 'js/tsconfig.json');

  browserify().
      add(inputFile, {
        insertGlobalVars: ['global'],
        ignoreMissing: true,
        builtins: false,
        commondir: false,
        browserField: false,
      }).
      plugin(tsify, {project: tsConfigFile}).
      bundle((err, buffer) => {
        if (err) {
          throw err;
        } else {
          fs.writeFileSync(outputFile, buffer);
        }
      });
}


function cssTask() {
  const cssDir = path.join(srcDir, 'css');
  const inputFile = path.join(cssDir, 'index.less');
  const outputFile = path.join(destDir, 'style.css');
  const lessInput = fs.readFileSync(inputFile, 'utf8');

  less.render(lessInput, {paths: cssDir})
    .then(output => fs.writeFileSync(outputFile, output.css))
    .catch(err => console.error(err));
}


staticTask();
jsTask();
cssTask();

const fs = require('fs');
const path = require('path');

const base = './src';
const dist = './dist';
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

const readDirectory = (base) => {
  const objs = fs.readdirSync(base);

  objs.forEach(obj => {
    const objPath = path.join(base, obj);
    const objState = fs.statSync(objPath);
    if (objState.isDirectory()) {
      readDirectory(objPath);
    } else {
      const parseObj = path.parse(obj);
      const newObjPath = path.join(dist, parseObj.name.toUpperCase());
      if (!fs.existsSync(newObjPath)) {
        fs.mkdirSync(newObjPath);
      }
      fs.linkSync(objPath, path.join(newObjPath, obj), (err) => {
        if (err) {
          console.error(err);
        }
        console.log('Copy created.');
      });
      fs.unlink(objPath, (err) => {
        if (err) {
          console.error(err);
        }
        console.log('Source file deleted.');
      });
    }
  });
};

readDirectory(base, 0);

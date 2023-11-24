const fs = require('fs');
const path = require('path');
const argv = process.argv.slice(2);

// 1 аргумент командной строки - исходная папка
// 2 аргумент командной строки - итоговая папка
// 3 аргумент командной строки - true/false (см. 47 строку)
const base = argv[0];
const dist = argv[1];
const delBase = argv[2];

if (!fs.existsSync(dist)) {
  fs.mkdir(dist, (err) => {
    if (err) {
      console.error(err);
    }
    console.log('Final folder created.');
  });
}

const readDirectory = (base) => {
  const objs = fs.readdir(base, (err) => {
    if (err) {
      console.error(err);
    }
  });

  objs.forEach(obj => {
    const objPath = path.join(base, obj);
    const objState = fs.stat(objPath, (err) => {
      if (err) {
        console.error(err);
      }
    });
    if (objState.isDirectory()) {
      readDirectory(objPath);
    } else {
      const parseObj = path.parse(obj);
      const newObjPath = path.join(dist, parseObj.name[0].toUpperCase());
      if (!fs.existsSync(newObjPath)) {
        fs.mkdir(newObjPath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }

      if (!fs.existsSync(path.join(newObjPath, obj))) {
        fs.link(objPath, path.join(newObjPath, obj), (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      fs.unlink(objPath, (err) => {
        if (err) {
          console.error(err);
        }
        console.log('Source file deleted.');
      });
    }
  });
  // Удаление исходной папки если 3 аргумент командной строки - true
  if (delBase === 'true') {
    fs.rmdir(base, (err) => {
      console.error(err);
    });
  }
};

readDirectory(base, 0);

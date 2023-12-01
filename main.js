const fs = require('fs');
const path = require('path');
const argv = process.argv.slice(2);

// 1 аргумент командной строки - исходная папка
// 2 аргумент командной строки - итоговая папка

const base = argv[0];
const dist = argv[1];

fs.mkdir(dist, (err) => {
  if (err && err.code !== 'EEXIST') {
    console.error(err);
  }
});

const readDirectory = (base) => {
  fs.readdir(base, (err, objs) => {
    if (err) console.error(err);

    objs.forEach(obj => {
      const objPath = path.join(base, obj);
      fs.stat(objPath, (err, stats) => {
        if (err) console.error(err);

        if (stats.isDirectory()) {
          readDirectory(objPath);
        } else {
          const parseObj = path.parse(obj);
          const newFolderPath = path.join(dist, parseObj.name[0].toUpperCase());
          const newObjPath = path.join(newFolderPath, obj);
          if (!fs.existsSync(newObjPath)) {
            fs.mkdir(newFolderPath, (err) => {
              if (err && err.code !== 'EEXIST') {
                console.error(err);
              }
              fs.link(objPath, newObjPath, (err) => {
                if (err && err.code !== 'EEXIST') {
                  console.error(err);
                }
              });
            });
          }
        }
      });
    });
  });
};

readDirectory(base, 0);

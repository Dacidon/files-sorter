const fs = require('fs');
const path = require('path');
const argv = process.argv.slice(2);

// 1 аргумент командной строки - исходная папка
// 2 аргумент командной строки - итоговая папка
// 3 аргумент командной строки - true/false (см. 47 строку)
const src = argv[0];
const dist = argv[1];
const delsrc = argv[2];

async function getStats (filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) reject(err);
      resolve(stats);
    });
  });
}

async function readDir (src) {
  return new Promise((resolve, reject) => {
    fs.readdir(src, (err, files) => {
      if (err) reject(err);

      resolve(files);
    });
  });
}

async function createFinalDir (dist) {
  return new Promise((resolve) => {
    fs.mkdir(dist, () => {
      console.log('Final folder created.');
    });
    resolve();
  });
}

async function createDir (newfilePath) {
  return new Promise((resolve) => {
    fs.mkdir(newfilePath, () => {
      console.log('New folder created.');
    });
    resolve();
  });
}

async function copyFile (filePath, newfilePath, file) {
  return new Promise((resolve) => {
    fs.link(filePath, path.join(newfilePath, file), () => {
      console.log('link done');
    });
    resolve();
  });
}

async function sort (src) {
  const files = await readDir(src);

  await createFinalDir(dist);
  for (const file of files) {
    const filePath = path.join(src, file);
    const stat = await getStats(filePath);

    if (stat.isDirectory()) {
      await sort(filePath);
    } else {
      const parsedfile = path.parse(file);
      const newfilePath = path.join(dist, parsedfile.name[0].toUpperCase());

      await createDir(newfilePath);
      await copyFile(filePath, newfilePath, file);
      console.log('file: ', newfilePath);
    }
  }
}

(async () => {
  try {
    await sort(src);

    if (delsrc === 'true') {
      // delete folder
    }
  } catch (error) {
    console.log(error);
  }
})();

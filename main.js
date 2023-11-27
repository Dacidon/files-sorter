const fs = require('fs');
const path = require('path');
const argv = process.argv.slice(2);

// 1 аргумент командной строки - исходная папка
// 2 аргумент командной строки - итоговая папка

const src = argv[0];
const dist = argv[1];

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

async function createDir (newFolderPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(newFolderPath, (err) => {
      if (err && err.code !== 'EEXIST') reject(err);
      resolve();
    });
  });
}

async function copyFile (filePath, newFilePath) {
  return new Promise((resolve) => {
    fs.link(filePath, newFilePath, () => {
      console.log('link done');
      resolve();
    });
  });
}

async function sort (src) {
  const files = await readDir(src);

  await createDir(dist);
  for (const file of files) {
    const filePath = path.join(src, file);
    const stat = await getStats(filePath);

    if (stat.isDirectory()) {
      await sort(filePath);
    } else {
      const parsedfile = path.parse(file);
      const newFolderPath = path.join(dist, parsedfile.name[0].toUpperCase());
      const newFilePath = path.join(newFolderPath, file);

      await createDir(newFolderPath);
      await copyFile(filePath, newFilePath);
    }
  }
}

(async () => {
  try {
    await sort(src);
  } catch (error) {
    console.log(error);
  }
})();

const fs = require("fs");
const fsP = require("fs").promises;
const path = require("path");

let dataFromTempate;
let dataFromComponents = {};

clear("project-dist/assets");

setTimeout(() => {
  readTempate();
  createFolder("project-dist", "assets");
  readComponents();
  copyFiles("assets");
  readStylesFiles();
}, 0);

async function clear(direct) {
  let directories = await fsP.readdir(path.join(__dirname, direct));
  for (let file of directories) {
    fsP.lstat(path.join(__dirname, direct, file)).then((data) => {
      if (data.isFile()) {
        fs.unlink(path.join(__dirname, direct, file), (err) => {});
      }

      if (data.isDirectory()) {
        fs.rmdir(path.join(__dirname, `${direct}/${file}`), (err) => {});
        clear(`${direct}/${file}`);
      }
    });
  }
}

async function createFolder(folderName, assetsName) {
  let directories = await fsP.readdir(path.join(__dirname));
  if (!!directories.find((el) => el == folderName)) {
    // clear();
  }
  if (!directories.find((el) => el == folderName)) {
    await fs.mkdir(path.join(__dirname, folderName), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  let assetsFolder = await fsP.readdir(path.join(__dirname, folderName));
  if (!assetsFolder.find((el) => el == assetsName)) {
    fs.mkdir(path.join(__dirname, folderName, assetsName), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}

async function readTempate() {
  const srcRead = path.join(__dirname, "template.html");
  const srcWriteHtml = path.join(__dirname, "project-dist/index.html");

  const readStream = new fs.ReadStream(srcRead, { encoding: "utf-8" });
  readStream.on("readable", async function () {
    let data = await readStream.read();
    if (data != null) {
      dataFromTempate = String(data);
      setTimeout(findTemplateTags, 200);
    }
  });
}

async function readComponents() {
  let componentsFiles = await fsP.readdir(path.join(__dirname, "components"));
  for (let file of componentsFiles) {
    const srcRead = path.join(__dirname, "components", file);
    const readStream = new fs.ReadStream(srcRead, { encoding: "utf-8" });
    readStream.on("readable", function () {
      let data = readStream.read();
      if (data != null) {
        dataFromComponents[file] = String(data);
      }
    });
  }
}
async function readStylesFiles() {
  let stylesFiles = await fsP.readdir(path.join(__dirname, "styles"));

  const srcWriteCss = path.join(__dirname, "project-dist", "style.css");

  fs.writeFile(srcWriteCss, ``, (err) => {
    if (err) throw err;
  });
  for (let file of stylesFiles) {
    const srcRead = path.join(__dirname, "styles", file);
    const readStream = new fs.ReadStream(srcRead, { encoding: "utf-8" });
    readStream.on("readable", function () {
      let data = readStream.read();
      if (data != null) {
        fs.appendFile(srcWriteCss, `\n${data}`, (err) => {
          if (err) throw err;
        });
      }
    });
  }
}

function findTemplateTags() {
  let arrFromTemplate = dataFromTempate.split("\r\n");
  let allTemplateTags = arrFromTemplate.filter((el) => el.split("").includes("{"));
  allTemplateTags = allTemplateTags.map((el) => el.replace(/\s/g, ""));
  for (let element of allTemplateTags) {
    replaceTagsOnInfo(element);
  }
  writeHtmlOnFile();
}

function replaceTagsOnInfo(tag) {
  let nameToFile = tag.replace(/{{/g, "").replace(/}}/g, ".html");
  dataFromTempate = dataFromTempate.replace(new RegExp(`${tag}`, "g"), dataFromComponents[nameToFile]);
}

function writeHtmlOnFile() {
  const srcWriteHtml = path.join(__dirname, "project-dist", "index.html");
  fs.writeFile(srcWriteHtml, `\n${dataFromTempate}`, (err) => {
    if (err) throw err;
  });
}

async function copyFiles(direct) {
  let arr = await fsP.readdir(path.join(__dirname, direct));
  for (let file of arr) {
    fsP.lstat(path.join(__dirname, direct, file)).then((data) => {
      if (data.isFile()) {
        const src = path.join(__dirname, direct, file);
        const srcWrite = path.join(__dirname, "project-dist", direct, file);
        fs.copyFile(src, srcWrite, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
      if (data.isDirectory()) {
        async function create() {
          let assetsFolder = await fsP.readdir(path.join(__dirname, "project-dist/assets"));
          if (!assetsFolder.find((el) => el == file)) {
            fs.mkdir(path.join(__dirname, "project-dist/assets", file), (err) => {
              if (err) {
                console.error(err);
              }
            });
          }
        }
        create();
        copyFiles(`assets/${file}/`);
      }
    });
  }
}

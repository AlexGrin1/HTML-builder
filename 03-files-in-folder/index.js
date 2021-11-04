const fs = require("fs");
const { resolve } = require("path");
const fsP = require("fs").promises;
const path = require("path");
let nextDir = async (pth) => {
  for (let file of await fsP.readdir(path.join(__dirname, "secret-folder"))) {
    fsP.lstat(path.join(__dirname, "secret-folder", file)).then((data) => {
      if (data.isFile()) {
        async function getName() {
          await fs.readdir(path.join(__dirname, "secret-folder"), function (err, files) {
            if (err) {
              console.error("Could not list the directory.", err);
              process.exit(1);
            }
            let name = file;
            const pathToFile = path.join(__dirname, name);
            const p = path.parse(pathToFile);
            async function getResult() {
              fs.stat(`${__dirname}/secret-folder/${p.base}`, (err, stats) => {
                if (err) throw err;
                console.log(`${p.name} - ${p.ext.split("").slice(1, -1).join("")} - ${stats.size / 1000} kb`);
              });
            }
            getResult();
          });
        }
        getName();
      }
    });
  }
};
nextDir();

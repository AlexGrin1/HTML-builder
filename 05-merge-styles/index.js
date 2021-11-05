const fs = require("fs");
const fsP = require("fs").promises;
const path = require("path");
async function getBundle() {
  await fs.unlink(path.join(__dirname, "project-dist", "bundle.css"), (err) => {});
  for (let file of await fsP.readdir(path.join(__dirname, "styles"))) {
    const pathToFile = path.join(__dirname, "styles", file);
    const p = path.parse(pathToFile);
    fsP.lstat(path.join(__dirname, "styles", file)).then((data) => {
      if (data.isFile() && p.ext == ".css") {
        const srcRead = path.join(__dirname, "styles", file);
        const srcWrite = path.join(__dirname, "project-dist", "bundle.css");

        const stream = new fs.ReadStream(srcRead, { encoding: "utf-8" });

        stream.on("readable", function () {
          let data = stream.read();
          if (data != null) {
            fs.appendFile(srcWrite, `\n${data}`, (err) => {
              if (err) throw err;
              console.log("Data has been added!");
            });
          }
          // if (data != null) {
          //   fs.writeFile(srcWrite, `\n${data}`, (err) => {
          //     if (err) throw err;
          //   });
          // }
        });
      }
    });
  }
}
getBundle();

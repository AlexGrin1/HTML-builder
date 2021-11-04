const fs = require("fs");
const fsP = require("fs").promises;
const path = require("path");

let copyDir = async (pth) => {
  let directoris = await fsP.readdir(path.join(__dirname));
  if (!directoris.find((el) => el == "files-copy")) {
    fs.mkdir(path.join(__dirname, "files-copy"), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  for (let file of await fsP.readdir(path.join(__dirname, "files"))) {
    //console.log(path.resolve("files", file));
    const src = path.join(__dirname, "files", file);
    const srcWrite = path.join(__dirname, "files-copy", file);
    fs.copyFile(src, srcWrite, (err) => {
      if (err) {
        console.error(err);
      }
    });
    const stream = new fs.ReadStream(src, { encoding: "utf-8" });

    stream.on("readable", function () {
      let data = stream.read();
      if (data != null) {
        fs.writeFile(srcWrite, `\n${data}`, (err) => {
          if (err) throw err;
        });
      }
    });
  }
  let directoryFiles = await fsP.readdir(path.join(__dirname, "files"));
  let copyDericoryFiles = await fsP.readdir(path.join(__dirname, "files-copy"));
  copyDericoryFiles.forEach((el) => {
    if (!directoryFiles.find((file) => file == el)) {
      fs.unlink(path.join(__dirname, "files-copy", el), (err) => {});
    }
    // console.log(el, " + ", path.join(__dirname, "files-copy", el));
  });
};
copyDir();

const fs = require("fs");
const path = require("path");
async function getName() {
  await fs.readdir(path.join(__dirname, "secret-folder"), function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }
    for (let name of files) console.log(name);
  });
}
getName();

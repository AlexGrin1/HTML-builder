const readline = require("readline");
const path = require("path");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function added() {
  fs.readdir(path.join(__dirname), function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }
    if (!files.find((el) => el == "text.txt")) {
      fs.open(`${__dirname}/text.txt`, "w", (err) => {
        if (err) throw err;
      });
    }
    // if (files.find) {
    //   fs.open(`${__dirname}/text.txt`, "w", (err) => {
    //     if (err) throw err;
    //     console.log("File created");
    //   });
  });
  // if (!!`${__dirname}/text.txt`) {
  //   fs.open(`${__dirname}/text.txt`, "w", (err) => {
  //     if (err) throw err;
  //     console.log("File created");
  //   });
  //}

  rl.question("Введите текст: ", function (answer) {
    if (answer == "exit") {
      console.log("Всего хорошего!");
      rl.close();
      return;
    }

    // } else {
    fs.appendFile(`${__dirname}/text.txt`, `\n${answer}`, (err) => {
      if (err) throw err;
      //   console.log("Data has been added!");
    });
    //}
    added();
    //rl.close();
  });
}
added();

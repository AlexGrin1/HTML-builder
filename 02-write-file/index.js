const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function added() {
  rl.question("Введите текст: ", function (answer) {
    if (answer == "exit") {
      console.log("Всего хорошего!");
      rl.close();
      return;
    }
    // if (!`${__dirname}/text.txt`) {
    //   fs.open("text.txt", "w", (err) => {
    //     if (err) throw err;
    //     console.log("File created");
    //   });
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

const fs = require("fs");
const src = `${__dirname}/text.txt`;

const stream = new fs.ReadStream(src, { encoding: "utf-8" });

stream.on("readable", function () {
  let data = stream.read();
  if (data != null) console.log(data);
});

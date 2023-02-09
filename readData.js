const fs = require("fs");

export default function handler(req, res) {
  let filename = req.body.type;

  let path = `../fileResp/${filename}.json`;

  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let d = JSON.parse(data);
    res.status(200).json(d.data);
  });
}

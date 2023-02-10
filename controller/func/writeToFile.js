const { json } = require("express");
const fs = require("fs");

//let path = "./../config/config.json"

async function writeFile(data) {
  let path = `./fileResp/${data.type}.json`;
  /*
  try {
    fs.writeFile(path, JSON.stringify(data), { flag: "w+" }, (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  } catch (err) {
    console.error(err);
  }
  */
}

module.exports = { writeFile };

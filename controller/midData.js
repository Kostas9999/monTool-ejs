const ds = require("./devInf/disc");
const users = require("./devInf/user");
const port = require("./devInf/ports");

async function getMidData() {
  let disc = await ds();
  let user = await users();
  let ports = await port();

  return { ports, disc, user };
}

module.exports = { getMidData };

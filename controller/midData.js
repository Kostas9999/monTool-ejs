const ds = require("./devInf/disc");
const users = require("./devInf/user");
const port = require("./devInf/ports");

module.exports = async function getData() {
  let disc = await ds();
  let user = await users();
  let ports = await port();

  return { ports, disc, user };
};

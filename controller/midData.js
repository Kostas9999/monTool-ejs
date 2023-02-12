const ds = require("./devInf/disc");
const users = require("./devInf/user");
const port = require("./devInf/ports");
const getArp = require("./devInf/getArp");

async function getMidData() {
  let disc = await ds();
  let user = await users();
  let ports = await port();
  let arp = await getArp();

  return { ports, disc, user, arp };
}

module.exports = { getMidData };

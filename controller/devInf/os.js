const si = require("systeminformation");
const nodeos = require("node:os");

let os;
let user;

module.exports = async function handler(req, res) {
  await si.osInfo((i) => {
    os = {
      hostname: i.hostname,
      version: i.distro,
      relese: i.release,
      build: i.build,
      // serial: i.serial,
    };
  });

  if (res != null) {
    res.status(200).json(os);
  }

  return os;
};

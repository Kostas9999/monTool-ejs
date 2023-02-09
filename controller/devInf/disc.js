const si = require("systeminformation");

module.exports = async function handler(req, res) {
  let disks;

  await si.fsSize((dg) => {
    disks = dg;
  });
  //console.log(disks);
  return disks;
};

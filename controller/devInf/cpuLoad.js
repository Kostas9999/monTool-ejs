const si = require("systeminformation");

module.exports = async function handler(req, res) {
  let load;

  await si.currentLoad((dg) => {
    load = Math.round(dg.currentLoad);
  });

  return load;
};

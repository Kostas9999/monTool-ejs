const si = require("systeminformation");

module.exports = async function handler(req, res) {
  let load;

  await si.mem((dg) => {
    load = Math.round(((dg.total - dg.free) / dg.total) * 100);
  });

  return load;
};

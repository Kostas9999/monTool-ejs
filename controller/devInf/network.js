const si = require("systeminformation");

let network;
module.exports = async function handler(req, res) {
  await si.networkInterfaces((i) => {
    for (const s of i) {
      if (s.default) {
        network = {
          iface: s.iface,
          speed: s.speed,
          mac: s.mac,
          IPv4: s.ip4,
          IPv4Sub: s.ip4subnet,
          IPv6: s.ip6,
          IPv6Sub: s.ip6subnet,
        };
      }
    }
  });

  //   if(res != null)

  //await res.status(200).json(network)

  return network;
};

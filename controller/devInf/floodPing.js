const { exec } = require("node:child_process");
const si = require("systeminformation");

let network;

async function getNetwork() {
  await si.networkInterfaces((i) => {
    for (const s of i) {
      if (s.default) {
        network = {
          IPv4: s.ip4,
          IPv4Sub: s.ip4subnet,
        };
      }
    }
    let networkPart = JSON.stringify(network.IPv4).substring(
      1,
      network.IPv4.lastIndexOf(".") + 1
    );

    for (let i = 1; i < 255; i++) {
      exec(`ping ${networkPart}.${i} -w 1 -n 1`);
    }
  });
}

module.exports = {
  getNetwork,
};

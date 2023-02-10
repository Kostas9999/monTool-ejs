const { exec } = require("node:child_process");
const si = require("systeminformation");
const { writeFile } = require("../func/writeToFile");

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

    for (let l = 1; l < 255; l++) {
      exec(`ping ${networkPart}.${l} -w 10 -n 1`);
    }

    let x = exec(`arp -a`, (error, out) => {
      let arpEntries = [];

      out.split("\r\n").forEach((d) => {
        d = d.replaceAll("'", "").trim();

        if (d.startsWith(networkPart)) {
          let cleanArr = [];
          d.split(" ").forEach((d) => {
            if (d.length > 0) {
              cleanArr.push(d);
            }
          });
          arpEntries.push({
            ip: cleanArr[0],
            mac: cleanArr[1],
            type: cleanArr[2],
          });
        }
      });

      writeFile({
        type: "DATA_ARP",
        data: arpEntries,
        time: new Date(),
      }); // write data to file
    });
  });
}

module.exports = {
  getNetwork,
};

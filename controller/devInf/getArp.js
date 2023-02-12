const { exec, execSync } = require("node:child_process");
const si = require("systeminformation");

module.exports = async function getArp() {
  let network;
  await si.networkInterfaces((i) => {
    for (const s of i) {
      if (s.default) {
        network = {
          IPv4: s.ip4,
          IPv4Sub: s.ip4subnet,
        };
      }
    }
  });

  let networkPart = network.IPv4.substring(
    0,
    network.IPv4.lastIndexOf(".") + 1
  );

  let out = execSync(`arp -a `).toString();
  out = out.split("\r\n");
  let tempArp = [];
  out.forEach((element) => {
    element = element.replace(/\s\s+/g, " ");
    tempArp.push(element.trim());
  });

  let cleanArp = [];
  tempArp.forEach((element) => {
    if (element.startsWith(networkPart)) {
      cleanArp.push(element);
    }
  });

  let temp = [];
  cleanArp.forEach((element) => {
    let d = element.split(" ");

    temp.push({
      ip: d[0],
      mac: d[1],
      type: d[2],
    });
  });

  return temp;
};

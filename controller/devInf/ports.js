// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//https://www.npmjs.com/package/systeminformation

const si = require("systeminformation");

module.exports = async function handler(req, res) {
  let list = [];
  let ports = [];
  await si.processes((processCB) => {
    list = processCB.list;
  });

  await si.networkConnections((networkCB) => {
    networkCB.forEach((element) => {
      if (element.state == "LISTEN") {
        for (const proc of list) {
          if (proc.pid == element.pid)
            ports.push({
              port: element.localPort,
              processName: proc.name,
              PID: proc.pid,
              processPath: proc.path,
              //  procmem: proc.mem.toFixed(2),
              // proccpu: proc.cpu.toFixed(2),
            });
        }
      }
    });
  });

  // if (res != null) {
  //  res.status(200).json(ports);
  //}

  return ports;
};

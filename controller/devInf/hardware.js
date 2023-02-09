// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const si = require("systeminformation");
let cpuLoad;
let memTotal;
let memFree;
let memProc;

let hardware;

module.exports = async function handler(req, res) {
  let HWUUID = "def";

  await si.mem((p) => {
    memTotal = p.total;
    memFree = p.free;
  });

  await si.uuid((cb) => {
    HWUUID = cb.hardware;
  });

  // await si.currentLoad((p) => {
  //   cpuLoad = p.currentLoad;
  //});

  await si.cpu((i) => {
    hardware = {
      HWUUID: HWUUID.replaceAll("-", "_"),
      Title:
        i.brand +
        " " +
        i.speed +
        "GHz " +
        i.physicalCores +
        "C/" +
        i.cores +
        "T",
      TotalMemory: memTotal,
      //  memProc: ((memTotal - memFree) / memTotal) * 100,
    };
  });

  // if (res != null) res.status(200).json(hardware);

  return hardware;
};

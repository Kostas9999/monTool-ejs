const networkStat = require("./devInf/netStats");

const cpuLoad = require("./devInf/cpuLoad");
const memLoad = require("./devInf/memoryLoad");

let oldData = ["none"];

async function getActiveData() {
  let networkStats = await networkStat();

  let cpu = await cpuLoad();
  let memory = await memLoad();
  oldData[0] = { networkStats, cpu, memory };

  return { networkStats, cpu, memory };
}

module.exports = { getActiveData, oldData };

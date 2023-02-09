const os_data = require("./devInf/os");
const hw_data = require("./devInf/hardware");
const network_data = require("./devInf/network");

module.exports = {
  getPassivedata: async function getData() {
    let os = await os_data();
    let hardware = await hw_data();
    let networkinterface = await network_data();

    return { os, hardware, networkinterface };
  },
};

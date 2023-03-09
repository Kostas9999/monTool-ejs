const { exec } = require("child_process");

const { getMidData } = require("../midData");
const { getActiveData } = require("../activeData");
const Arp = require("../devInf/getArp");
const { getNetwork } = require("../devInf/floodPing");

async function processMSG(d) {
  data = JSON.parse(d);

  if (data.type == "MSG") {
  } else if (data?.type == "POSTBOX") {
    console.log(data);
    if (data?.data?.type == "GET") {
      console.log("GET " + data?.data?.msg);
      if (data?.data?.msg == "ACTIVE_DATA") {
        sendActiveData();
      }
      if (data?.data?.msg == "MID_DATA") {
        sendMidData();
      }
      if (data?.data?.msg == "PASSIVE_DATA") {
        sendPassiveData();
      }
      if (data?.data?.msg == "ARP_DATA") {
        sendArpData();
      }
    } else if (data?.data?.cmd == "PRT_CLOSE") {
      exec(`taskkill /F /PID ${data.data.param}`);
    } else if (data?.data?.param == "RESTART") {
      exec(`shutdown /r -t 60`);
    } else if (data?.data?.param == "SHUTDOWN") {
      exec(`shutdown /s -t 60`);
    } else if (data?.data?.param == "CANCEL_SHUTDOWN") {
      exec(`shutdown -a`);
    }
  }
}

function sendActiveData() {
  getActiveData().then((data) => {
    client.write(
      JSON.stringify({
        type: "DATA_ACTIVE",
        UID: my_UID,
        data: data,
      })
    );
  });
}

async function sendMidData() {
  getNetwork();
  getMidData().then((data) => {
    client.write(
      JSON.stringify({
        type: "DATA_MID",
        UID: my_UID,
        data: data,
      })
    );
  });
}

function sendPassiveData() {
  getPassivedata().then((data) => {
    client.write(
      JSON.stringify({
        type: "DATA_PASSIVE",
        UID: my_UID,
        data: data,
      })
    );
  });
}
function sendArpData() {
  Arp.getArp().then((data) => {
    buffer.setArp(data);
    client.write(
      JSON.stringify({
        type: "DATA_ARP",
        UID: my_UID,
        data: data,
      })
    );
  });
}

module.exports = { processMSG };

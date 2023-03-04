const { exec } = require("child_process");

const { getPassivedata } = require("../passiveData");
const { getMidData } = require("../midData");
const { getActiveData } = require("../activeData");
const Arp = require("../devInf/getArp");
const { getNetwork } = require("../devInf/floodPing");

async function processMSG(d) {
  data = JSON.parse(d);

  //sort data received from server

  if (data.type == "MSG") {
    console.log(data.data);
  } else if (data?.type == "POSTBOX") {
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
    } else if (data?.data?.type == "EXEC") {
      let exec_data = JSON.parse(data.data.data);

      console.log("TODO: EXEC message received");
      if (exec_data.param == "RESTART") {
        exec(`shutdown /r -t 60`);
      } else if (exec_data.param == "SHUTDOWN") {
        exec(`shutdown /s -t 60`);
      } else if (exec_data.cmd == "PRT_CLOSE") {
        exec(`taskkill /F /PID ${exec_data.param}`);
      }
    }
  }
}

function sendActiveData() {
  getActiveData().then((data) => {
    buffer.setActive(data);
    client.write(
      JSON.stringify({
        type: "DATA_ACTIVE",
        UID: my_UID,
        data: data,
      })
    );
  });
}

function sendMidData() {
  getNetwork();
  getMidData().then((data) => {
    buffer.setMid(data);
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
    buffer.setPassive(data);
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

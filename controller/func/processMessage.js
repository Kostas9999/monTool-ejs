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
  } else if (data.type == "POSTBOX") {
    if (data.data.type == "GET") {
      console.log("GET " + data.data.msg);
      if (data.data.msg == "ACTIVE_DATA") {
        sendActiveData();
      }
      if (data.data.msg == "MID_DATA") {
        sendMidData();
      }
      if (data.data.msg == "PASSIVE_DATA") {
        sendPassiveData();
      }
      if (data.data.msg == "ARP_DATA") {
        sendArpData();
      }
    } else if (data.data.type == "EXEC") {
      console.log("EXEC " + data.data.msg);
      console.log("TODO: EXEC message received");

      // direct execution sending arp as demo
      // replace command with -  data.data.msg
      client.write(
        JSON.stringify({ type: "MSG", data: "Sending ARP as Demo" })
      );
      exec(`arp -a `, function (err, stdout, stderr) {
        client.write(JSON.stringify({ type: "MSG", data: stdout }));
      });
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

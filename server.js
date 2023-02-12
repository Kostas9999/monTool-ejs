const tls = require("tls");
const fs = require("fs");
const dotenv = require("dotenv");
const { exec } = require("child_process");
const { getPassivedata } = require("./controller/passiveData");
const { writeFile } = require("./controller/func/writeToFile");
const { getMidData } = require("./controller/midData");
const { getActiveData } = require("./controller/activeData");
const buffer = require("./fileResp/Buffer");
const { getNetwork } = require("./controller/devInf/floodPing");
const Arp = require("./controller/devInf/getArp");

///////////=================================== WEB

getActiveData().then((data) => buffer.setActive(data));
getMidData().then((data) => buffer.setMid(data));
getPassivedata().then((data) => buffer.setPassive(data));

///////////===========================================

dotenv.config({ path: "./config/config.env" });

let client;

let my_UID;
module.exports = my_UID;
let checkPassive_Interval = 1800000;
let checkMid_Interval = 11000;
let checkActive_Interval = 5000;

let checkUserId_Interval = 10000;

const options = {
  host: "185.38.61.93",
  //servername: "localhost",
  //host: "127.0.0.1",
  port: 57070,

  //ca: fs.readFileSync("./cert/ca.pem"),
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
  passphrase: "MGproject",
  rejectUnauthorized: false,
};

getConnected();
async function getConnected() {
  client = tls.connect(options, async () => {
    await getUID();
    buffer.setUID(my_UID);

    client.setEncoding("utf8");
    client.write(JSON.stringify({ type: "HELLO", UID: my_UID, data: my_UID }));
  });

  client.on("error", (e) => {
    if (e.code == "ECONNREFUSED") {
      let x;
      clearTimeout(x);
      console.log("Connection Refused: Reconnecting...");
      x = setTimeout(getConnected, checkUserId_Interval);
      //console.log((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2));
    }
  });

  client.on("data", (data) => {
    onData(data);
  });

  async function getUID() {
    console.log("Getting Device ID...");

    my_UID = (await getPassivedata()).hardware.HWUUID;
    if (typeof my_UID !== "undefined") {
      console.log(`ID: ${my_UID}`);

      sendPassiveData();
      sendData();
    } else {
      setTimeout(getUID, checkUserId_Interval);
    }
  }

  function sendData() {
    setInterval(sendActiveData, checkActive_Interval);
    setInterval(sendMidData, checkMid_Interval);
    setInterval(sendPassiveData, checkPassive_Interval);
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

      writeFile({
        type: "DATA_ACTIVE",
        data: data,
        time: new Date(),
      }); // write data to file
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

      writeFile({
        type: "DATA_MID",
        data: data,
        time: new Date(),
      }); // write data to file
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

      writeFile({
        type: "DATA_PASSIVE",
        data: data,
        time: new Date(),
      }); // write data to file
    });
  }

  //client.on("data", (d) => {
  // onData(d);
  //});

  client.on("end", () => {
    console.log("client disconnected");
  });

  client.on("error", (e) => {
    console.log("Error - " + e);

    if (e.code == "ECONNRESET") {
      console.log("Server down");
      setTimeout(getConnected, 5000);
    }

    if (e.code == "ECONNREFUSED") {
      console.log("Connection Refused\nReconnecting...");
      setTimeout(getConnected, 5000);
    }
  });
}

getNetwork();
Arp.getArp().then((data) => {
  buffer.setArp(data);
});

function onData(d) {
  data = JSON.parse(d);

  //sort data received from server

  if (data.type == "MSG") {
    console.log(data.data);
  } else if (data.type == "POSTBOX") {
    //console.log("Post: " + data.data.type + "   " + data.data.msg);

    if (data.data.type == "GET") {
      console.log("GET " + data.data.msg);
    } else if (data.data.type == "EXEC") {
      console.log("EXEC " + data.data.msg);

      //  exec(data.data.msg, function (err, stdout, stderr) {
      // direct execution
      //   client.write(JSON.stringify({ type: "MSG", data: stdout }));
      //});
    }
  }
}

/*
Traffic: Monitor the amount of data being transferred across the network, including both inbound and outbound traffic. This can help identify potential bottlenecks or connectivity issues.

Bandwidth: Monitor the available bandwidth on the network, and track how much of it is being utilized at any given time. This can help identify situations where the network is becoming overloaded.

Latency: Monitor the amount of time it takes for data to travel across the network, also known as "ping" time. High latency can indicate a problem with the network or a specific connection.

Packet loss: Monitor the number of packets that are being lost or dropped during transmission. This can be an indication of a problem with the network or a specific device.

Availability: Monitor the availability of network devices and services. This can include devices like routers, switches, and servers, as well as services like DNS or DHCP.

Security: Monitor network security-related events, such as attempted unauthorized access or suspicious traffic patterns.

CPU, Memory, Disk usage: Monitor the usage of these resources on the devices connected to the network, it can indicate if a device is overloaded and need to be replaced or upgraded.


*/

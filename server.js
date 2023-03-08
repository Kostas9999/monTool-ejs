const tls = require("tls");
const fs = require("fs");
const dotenv = require("dotenv");

const { getPassivedata } = require("./controller/passiveData");
const { getMidData } = require("./controller/midData");
const { getActiveData } = require("./controller/activeData");
const { getNetwork } = require("./controller/devInf/floodPing");

const buffer = require("./fileResp/Buffer");
const Arp = require("./controller/devInf/getArp");

const { processMSG } = require("./controller/func/processMessage");

let active_Interval;
let mid_Interval;
let passive_Interval;

///////////================ populated data to be used in WEB
// dont send it as its not connected yet

getActiveData().then((data) => buffer.setActive(data));
getMidData().then((data) => buffer.setMid(data));
getPassivedata().then((data) => buffer.setPassive(data));

///////////===========================================

dotenv.config({ path: "./config/config.env" });

let client;

let my_UID;
module.exports = my_UID;
let checkPassive_Interval = 1800000;
let checkMid_Interval = 6000;
let checkActive_Interval = 5000;
let checkUserId_Interval = 10000;

// ===========================================  connection settings
const options = {
  // host: "185.38.61.93",
  //servername: "localhost",
  host: "127.0.0.1",
  port: 57070,

  //ca: fs.readFileSync("./cert/ca.pem"),
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
  passphrase: "MGproject",
  rejectUnauthorized: false,
};

// ===========================  connection settings end

//============================================== get connected to a server
getNetwork(); //  check neighbords by ping "broadcast"

getConnected();
async function getConnected() {
  client = null;
  client = tls.connect(options, async () => {
    // get machine ID to inform server who are connecting to
    await getUID();
    buffer.setUID(my_UID);

    // set encoding and send hello message on succesfull connection
    client.setEncoding("utf8");
    client.write(JSON.stringify({ type: "HELLO", UID: my_UID, data: my_UID }));
  }); //=============== end of tls.connect

  client.on("data", (data) => {
    processMSG(data);
  });

  client.on("error", (e) => {
    onERORR(e);
  });
}

//============================================================
//==================== Hnadle connection errors ==============

function onERORR(e) {
  console.log(e);
  let t;

  clearTimeout(t);
  clearInterval(active_Interval);
  clearInterval(mid_Interval);
  clearInterval(passive_Interval);
  if (e.code == "ECONNRESET") {
    console.log("Disconnected from a server");
  } else if (e.code == "ECONNREFUSED") {
    console.log("Connection Refused\nReconnecting...");
  } else if (e.code == "ETIMEDOUT") {
    console.log("Connection Timed out\nServer Down\nReconnecting...");
  } else {
    console.log("Unhandled Error - " + e);
  }
  t = setTimeout(getConnected, checkUserId_Interval);
}

//============================================================
//====================== Send Data ===========================

async function sendData() {
  active_Interval = setInterval(sendActiveData, checkActive_Interval);
  mid_Interval = setInterval(sendMidData, checkMid_Interval);
  passive_Interval = setInterval(sendPassiveData, checkPassive_Interval);
}

async function sendActiveData() {
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

async function sendMidData() {
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

async function sendPassiveData() {
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

//============================================================
//===================== get User ID ==========================

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

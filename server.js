const tls = require("tls");
const fs = require("fs");
const dotenv = require("dotenv");

const checksum = require("checksum");

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

// Data stored in a buffer to be used in WEB

getActiveData().then((data) => buffer.setActive(data));
getMidData().then((data) => buffer.setMid(data));
getPassivedata().then((data) => buffer.setPassive(data));

///////////===========================================

// get environment variables
dotenv.config({ path: "./config/config.env" });

let client, server;

let my_UID;
module.exports = my_UID;

// setting intervals for for collecting data

let checkPassive_Interval = 3600000;
let checkMid_Interval = 13000;
let checkActive_Interval = 10000;
let checkUserId_Interval = 10000;

// ===========================================  connection settings
let options = []; // to keep array of awailable servers that is provided by an API
let attempt = 0; // count attempt to connect to be used as index in array for available servers

if (options.length == 0) {
  options[0] = {
    host: "127.0.0.1",
    //host: "185.38.61.93", // homehosting
    //  host: "3.249.58.118", // Amazon

    port: 57070, // default port, using 443 to bypass public network restriction

    // certification for connection
    key: fs.readFileSync("./cert/key.pem"),
    cert: fs.readFileSync("./cert/cert.pem"),
    passphrase: "MGproject",

    // drop connection for unouthorized users (no inbound connection expected, might be removed)
    rejectUnauthorized: false,
  };
}

// ===========================  connection settings end

//======================================================================== get connected to a server
getNetwork(); //  check neighbords by ping "broadcast" (suspended "high cpu usage")

// start connection
getConnected();
async function getConnected() {
  console.log(
    `connecting to ${options[attempt % options.length].host}:${
      options[attempt % options.length].port
    }`
  );
  client = null;
  client = tls.connect(options[attempt % options.length], async () => {
    server = {
      ip: options[attempt % options.length].host,
      port: options[attempt % options.length].port,
    };

    // get machine ID to inform server who are connecting to
    await getUID();
    buffer.setUID(my_UID);

    // set encoding and send hello message on succesfull connection
    client.setEncoding("utf8");
    let chksum = checksum(JSON.stringify(my_UID));
    client.write(
      JSON.stringify({
        type: "HELLO",
        UID: my_UID,
        data: my_UID,
        trailer: { CHECKSUM: chksum },
      })
    );
  }); //=============== end of tls.connect

  client.on("data", async (data) => {
    console.log(data);
    //processMSG(data);
  });

  client.on("error", (e) => {
    onERORR(e);
    attempt++;
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
    let chksum = checksum(JSON.stringify(data));
    console.log("active sent");
    buffer.setActive(data);
    client.write(
      JSON.stringify({
        type: "DATA_ACTIVE",
        UID: my_UID,
        data: data,
        trailer: { CHECKSUM: chksum },
      })
    );
  });
}

async function sendMidData() {
  getNetwork();
  getMidData().then((data) => {
    let chksum = checksum(JSON.stringify(data));
    buffer.setMid(data);
    client.write(
      JSON.stringify({
        type: "DATA_MID",
        UID: my_UID,
        data: data,
        trailer: { CHECKSUM: chksum },
      })
    );
  });
}

async function sendPassiveData() {
  getPassivedata().then((data) => {
    data.server = server;
    let chksum = checksum(JSON.stringify(data));
    buffer.setPassive(data);
    client.write(
      JSON.stringify({
        type: "DATA_PASSIVE",
        UID: my_UID,
        data: data,
        trailer: { CHECKSUM: chksum },
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
getOptions();
async function getOptions() {
  const res = await fetch(
    "https://montool.vercel.app/api/serverList?passkey=groupproject"
  );
  const getSrv = (await res.json()).serverList;

  getSrv.forEach((element) => {
    options.push({
      host: element.ip,
      port: element.port,

      key: fs.readFileSync("./cert/key.pem"),
      cert: fs.readFileSync("./cert/cert.pem"),
      passphrase: "MGproject",
      rejectUnauthorized: false,
    });
  });
}

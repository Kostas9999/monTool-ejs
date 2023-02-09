const tls = require("tls");
const fs = require("fs");
const client = require("./client");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

let checkPassive_Interval = 50000;
let checkActive_Interval = 5000;
let checkUserId_Interval = 10000;
/*
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

*/
getConnected();
async function getConnected() {
  /* client = tls.connect(options, () => {
    client.setEncoding("utf8");
    client.write("Hello from the client!");
  });
*/
  client.on("error", (e) => {
    if (e.code == "ECONNREFUSED") {
      console.log("Connection Refused: Reconnecting...");
      setTimeout(getConnected, checkUserId_Interval);
    }
  });

  client.on("data", (data) => {
    if (data.startsWith("EXEC")) {
      console.log("have to execute smth:\n" + data);
    } else {
      console.log(data);
    }
  });

  return client;
}

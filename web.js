const server = require("./server");
const buff = require("./fileResp/Buffer");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");

app.use(bodyParser());
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let UID = buff.getUID();
  let aData = buff.getActive();
  let mData = buff.getMid();
  let pData = buff.getPassive();
  let arpData = buff.getArp();

  if (!UID || !aData || !mData || !pData || !arpData) {
    console.log("here");
    res.render("preparing");
  }

  res.render("index", { UID, aData, mData, pData, arpData });
});

app.listen(57071, function () {
  console.log("Web started on 57071");
});
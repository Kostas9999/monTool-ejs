const { buff } = require("./data");

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

  res.render("index", { UID, aData, mData, pData, arpData });
});

app.listen(3000, function () {
  console.log("Web started on 3000");
});

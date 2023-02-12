var DATA_ACTIVE;
var DATA_ARP;
var DATA_MID;
var DATA_PASSIVE;
var UID;

function setActive(data) {
  DATA_ACTIVE = data;
}
function getActive() {
  return DATA_ACTIVE;
}

function getUID() {
  return UID;
}

function setUID(data) {
  this.UID = data;
}

function setActive(data) {
  DATA_ACTIVE = data;
}

function setArp(data) {
  DATA_ARP = data;
}

function setMid(data) {
  DATA_MID = data;
}
function setPassive(data) {
  DATA_PASSIVE = data;
}

function getArp() {
  return DATA_ARP;
}

function getMid() {
  return DATA_MID;
}
function getPassive() {
  return DATA_PASSIVE;
}

module.exports = {
  setActive,
  setArp,
  setMid,
  setPassive,
  setUID,
  getActive,
  getArp,
  getMid,
  getPassive,
  getUID,
};

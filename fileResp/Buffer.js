let DATA_ACTIVE;
let DATA_ARP;
let DATA_MID;
let DATA_PASSIVE;

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

function getActive() {
  return DATA_ACTIVE;
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
  getActive,
  getArp,
  getMid,
  getPassive,
  setActive,
  setArp,
  setMid,
  setPassive,
};

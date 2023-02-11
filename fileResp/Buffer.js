class buffer {
  static DATA_ACTIVE;

  static setActive(data) {
    DATA_ACTIVE = data;
  }
  static getActive() {
    return DATA_ACTIVE;
  }

  static getUID() {
    return UID;
  }

  static setUID(data) {
    UID = data;
  }

  static setActive(data) {
    DATA_ACTIVE = data;
  }

  static setArp(data) {
    DATA_ARP = data;
  }

  static setMid(data) {
    DATA_MID = data;
  }
  static setPassive(data) {
    DATA_PASSIVE = data;
  }

  static getArp() {
    return DATA_ARP;
  }

  static getMid() {
    return DATA_MID;
  }
  static getPassive() {
    return DATA_PASSIVE;
  }
}
let DATA_ACTIVE;
let DATA_ARP;
let DATA_MID;
let DATA_PASSIVE;
let UID;

module.exports = {
  buffer,
};

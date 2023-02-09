const si = require("systeminformation");

module.exports = async function handler(req, res) {
  let user;
  await si.users((dg) => {
    user = {
      username: dg[0].user,
      loginTime: dg[0].date + " " + dg[0].time,
    };
  });

  return user;
};

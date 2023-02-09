// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const si = require("systeminformation");
const { exec, spawn, execSync } = require("node:child_process");

let netStats;

module.exports = async function handler(req, res) {
  let localLatency;
  let publicLatency;
  let defaultGateway;

  await si.networkGatewayDefault((defaultInt) => {
    si.inetLatency(defaultInt, (response) => {
      localLatency = response;
    });
  });

  await si.networkGatewayDefault((dg) => {
    defaultGateway = dg;
  });

  await si.inetLatency((response) => {
    publicLatency = response;
  });

  function getDefaultGatewayMAC() {
    let result = "";

    out = execSync(`arp -a ${defaultGateway}`).toString();
    out = out.split("\r\n")[3];
    out = out.substring(15).trim().substring(0, 17);
    result = out;

    return result;
  }

  await si.networkStats((s) => {
    //   console.log(s[0].tx_sec); //can be used for live data or on event
    // console.log(s[0].rx_sec);

    networkStats = {
      iface: s[0].iface,
      rx_total: s[0].rx_bytes,
      rx_dropped: s[0].rx_dropped,
      rx_error: s[0].rx_errors,
      tx_total: s[0].tx_bytes,
      tx_dropped: s[0].tx_dropped,
      tx_error: s[0].tx_errors,
      localLatency: localLatency,
      publicLatency: publicLatency,
      defaultGateway: defaultGateway,
      dgMAC: getDefaultGatewayMAC(),
    };

    // truncate data for most common values // TODO: !!  should be a better way than removing keys - revise!!
    /*

    if (s[0].rx_errors == 0) {
      delete networkStats.rx_error;
    }
    if (s[0].rx_dropped == 0) {
      delete networkStats.rx_dropped;
    }
    if (s[0].tx_errors == 0) {
      delete networkStats.tx_error;
    }
    if (s[0].tx_dropped == 0) {
      delete networkStats.tx_dropped;
    }
    if (localLatency == 0) {
      delete networkStats.localLatency;

    }

      */
  });

  /*  /////////////////////////   backup  25/01/23  (before trunkating data)
  await si.networkStats(s=>{  

    netStats = { 
      iface : s[0].iface,
      state : s[0].operstate,
      rx_total : s[0].rx_bytes,
      rx_Dropped : s[0].rx_dropped,
      rx_error : s[0].rx_errors,
      tx_total : s[0].tx_bytes,
      tx_Dropped : s[0].tx_dropped,
      tx_error : s[0].tx_errors,
      localLatency : localLatency,
      publicLatency : publicLatency,
  }
  
    })
*/

  // if (res != null) { res.status(200).json(netStats);}  // for api NOT USED !!
  return networkStats;
};

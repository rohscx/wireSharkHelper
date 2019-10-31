const clipboardy = require('clipboardy');
const nU = require('nodeutilz');
/* 
    EXPORT DATA FROM wireshare as an object after filtering the SRC MAC address of the target client. 
    Results can be pasted here. might want to create a data loader.
    The resulting data should only contain unique Sockets
    The Socket can be used to craft an IP Access list, e.g. Cisco ISE DACL
*/

const debug = true; // used to copy data to clipboard

const currentDate = Date.now();
const savePath0= `./export/uniqueSockets_${currentDate}`;
const fileType0 = 'utf8';
const data = require('./import/testest.json');

  

const refined = data.map((d) => {
    const srcIp = d._source.layers.ip['ip.src'];
    const dstIp = d._source.layers.ip['ip.dst'];
    const dstPort = d._source.layers.tcp ? d._source.layers.tcp['tcp.dstport'] : d._source.layers.udp['udp.dstport'];
    const dstPortType = d._source.layers.tcp ? 'TCP' : "UDP"//?
    return {srcIp,dstIp,dstPort,dstPortType};
})

const deduped = Array.from(new Set(refined.map(JSON.stringify))).map(JSON.parse);
const stringified = JSON.stringify(deduped);
nU.writeFile(savePath0, stringified, fileType0);
if (debug === true) clipboardy.writeSync(stringified);

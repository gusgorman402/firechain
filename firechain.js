var Web3 = require('web3');
var cmd = require('node-cmd');
var localip = require('local-ip');

var iface = 'eth1';
var webcamIP = '192.168.1.123';
var openPortCmd = 'iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j DNAT --to 192.168.1.2:8080';
var openPortCmd2 = 'iptables -A FORWARD -p tcp -d 192.168.1.2 --dport 8080 -j ACCEPT';
var closePortCmd = 'iptables -D PREROUTING -t nat -i eth0 -p tcp --dport 80 -j DNAT --to 192.168.1.2:8080';
var closePortCmd2 = 'iptables -D FORWARD -p tcp -d 192.168.1.2 --dport 8080 -j ACCEPT';
var checksumCmd = 'md5sum /dev/mtdblock5';
var routerAddress = '0xD89F06F504f806f5927121e3E5E6A83E050F2942';

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var firechainABI = web3.eth.contract( [{"constant":true,"inputs":[],"name":"getIPaddress","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPortStatus","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ipAddress","type":"string"}],"name":"setIPaddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"setPhyInspectionDate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPhyInspectionDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getRouterName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_checksum","type":"string"}],"name":"setFirmwareChecksum","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"toggleWebcamPort","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getFirmwareChecksum","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"address"},{"indexed":false,"name":"portStatus","type":"bool"}],"name":"PortStatusChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"address"}],"name":"IPaddressChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"address"}],"name":"FirmwareChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"address"}],"name":"PhysicalInspection","type":"event"}]  );


var firechain = firechainABI.at('0x61F5abc0e2ee791f2f287F40d13a6469E9246F56');

var checksumFunc = function () { firechain.getFirmwareChecksum(function(error,result) {
  if(!error) {
    cmd.get(checksumCmd, function(err,res) {
      if(!err) {
        if( result != res ){
          firechain.setFirmwareChecksum(res, {from: routerAddress}, function(e,r){});
        }
      }
    });
   }
 });
}

var currentIP = function () { localip(iface, function(error, result){
  if(!error) {
    firechain.getIPaddress(function(err,res) {
      if(!err) {
        if(res != result) {
          firechain.setIPaddress(result, {from: routerAddress}, function(e,r){});
        }
      }
    });
   }
 }); 
}

firechain.getPortStatus( function(err,res) {
  if(!err) {
    if( res == 'Port is Open' ) { cmd.run(openPortCmd); }
    else{ cmd.run(closePortCmd); }
  }
});

var portToggleEvent = firechain.PortStatusChanged(function(error,result) {
  if(!error){
    if(result.args.webcamPortStatus == 'Port is Open'){
      cmd.run(openPortCmd);
    }
    else {
      cmd.run(closePortCmd);
    }
  }
});


setTimeout( currentIP, 300000);

setTimeout( checksumFunc, 1200000);



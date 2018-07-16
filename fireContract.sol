pragma solidity ^0.4.15;

contract fireChain {
    
    address owner;
    address router;
    string routerName;
    string ipAddress;
    string firmwareChecksum;
    uint lastPhyInspectDate;
    bool webcamPortStatus;
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyRouter {
        require(msg.sender == router);
        _;
    }
    
    event PortStatusChanged(address id, bool portStatus);
    event IPaddressChanged(address id);
    event FirmwareChanged(address id);
    event PhysicalInspection(address id);

    function fireChain() public {
        owner = msg.sender;
        router = 0xD89F06F504f806f5927121e3E5E6A83E050F2942;
        routerName = "LinksysWRT1900ACS";
        webcamPortStatus = false;
        firmwareChecksum = "00000000000";
        ipAddress = "0.0.0.0";
        lastPhyInspectDate = 0;
    }
    
    function getPortStatus() public constant returns (string) {
        if(webcamPortStatus){ return "Port is Open"; }
        else{ return "Port is Closed"; }
    }
    
    function getIPaddress() public constant returns (string) {
        return ipAddress;
    }
    
    function getFirmwareChecksum() public constant returns (string) {
        return firmwareChecksum;
    }
    
    function getPhyInspectionDate() public constant returns (uint) {
        return lastPhyInspectDate;
    }
    
    function getRouterName() public constant returns (string) {
        return routerName;
    }
    
    function toggleWebcamPort() public onlyOwner {
        if(webcamPortStatus){ webcamPortStatus = false; }
        else{ webcamPortStatus = true; }
        emit PortStatusChanged(msg.sender, webcamPortStatus);
    }
    
    function setIPaddress(string _ipAddress) public onlyRouter {
        ipAddress = _ipAddress;
        emit IPaddressChanged(msg.sender);
    }
    
    function setFirmwareChecksum(string _checksum) public onlyRouter {
        firmwareChecksum = _checksum;
        emit FirmwareChanged(msg.sender);
    }
    
    function setPhyInspectionDate() public onlyOwner {
        lastPhyInspectDate = block.timestamp;
        emit PhysicalInspection(msg.sender);
    }
    
}

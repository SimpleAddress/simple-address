// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract SimpleAddressCore {
    // Data structures for simpleID to meta address
    mapping(string => address) nameToMeta;
    mapping(address => string) metaToName;

    // Data structures for meta address to sub address connections
    struct connection{
        address theOther;
        uint selfActionTime;
    }
    struct set{
        connection[] connections;
        mapping(address=>bool) exists;
    }
    mapping(address => set) metaToSub;
    mapping(address => set) subToMeta;

    // Events
    event Registered(address meta, string name);
    event Requested(address meta, address sub, address sender);
    event Approved(address meta, address sub, address sender);

    // Modifiers
    modifier senderIsNotThirdParty(address meta, address sub){
        require(msg.sender==meta || msg.sender==sub, "Insufficient access for approval");
        _;
    }


    // Helper functions
    function _isValidName(string memory name) internal pure returns(bool validity){
        //Pre-Process name (a-z, 0-9, [.], [-], [_]), Not starting with special characters
        //WIP

        //Simple Test
        validity = bytes(name).length>0;
    }

    function _isRegisteredAddress(address addr) internal view returns (bool) {
        return bytes(metaToName[addr]).length > 0;
    }

    function _isSubAddress(address addr) internal view returns (bool) {

        // check if the address has an association with a meta address
        connection[] memory conns = subToMeta[addr].connections;
        for(uint i = 0; i < conns.length; i++){
            if( conns[i].selfActionTime != 0 ){
                return true;
            }
        }
        return false;
    }

    
    // SimpleID to MetaAddress related functions
    function registerAddress(string memory name) public {
        require(_isRegisteredAddress(msg.sender) == false, "Address already registered");
        require(_isSubAddress(msg.sender) == false, "Address already within Meta address(es)");
        require(_isValidName(name) == true, "Invalid Name");
        require(nameToMeta[name] == address(0), "Name not available");


        nameToMeta[name] = msg.sender;
        metaToName[msg.sender] = name;
        emit Registered(msg.sender, name);
    }

    function findByName(string memory name) public view returns(address meta){
        meta = nameToMeta[name];
    }
    function findByMeta(address meta) public view returns(string memory name){
        name = metaToName[meta];
    }


    // MetaAddress to SubAddress related functions
    function associate(address meta, address sub) public senderIsNotThirdParty(meta, sub) returns(bool) {
        require(_isRegisteredAddress(meta) == true, "Invalid Meta address");
        require(_isRegisteredAddress(sub) == false, "Invalid Sub address. A Meta address cannot be a Sub address");
        
        if( msg.sender == meta ){
            require(metaToSub[meta].exists[sub] == false, "Association already exists");
            metaToSub[meta].exists[sub]=true;
            connection memory conn = connection(sub, block.timestamp);
            metaToSub[meta].connections.push(conn);
        } else if ( msg.sender == sub ) {
            require(subToMeta[sub].exists[meta] == false, "Association already exists");
            subToMeta[sub].exists[meta]=true;
            connection memory conn = connection(meta, block.timestamp);
            subToMeta[sub].connections.push(conn);
        }

        if(metaToSub[meta].exists[sub] && subToMeta[sub].exists[meta]){
            emit Approved(meta, sub, msg.sender);
        } else {
            emit Requested(meta, sub, msg.sender);
        }
        return true;
    }

    function viewConnections(address addr, bool verified) public view returns (connection[] memory conns){
        if(_isRegisteredAddress(addr)==true){
            //If only verified accounts have been asked, this deletes the unverified associations
            conns = metaToSub[addr].connections;
            for(uint i = 0; i<conns.length; i++){
                if(verified==true && subToMeta[conns[i].theOther].exists[addr]==false){
                    delete conns[i];
                    continue;
                }
            }
        }
        else{
            //If only verified accounts have been asked, this deletes the unverified associations
            conns = subToMeta[addr].connections;
            for(uint i = 0; i<conns.length; i++){
                if(verified==true && metaToSub[conns[i].theOther].exists[addr]==false){
                    delete conns[i];
                    continue;
                }
            }
        }
    }
}

// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

contract SimpleAddressCore {
    using Address for address;
    using EnumerableSet for EnumerableSet.AddressSet;

    // Data structures for simpleID to meta address
    mapping(string => address) nameToMeta;
    mapping(address => string) metaToName;

    // Data structures for meta address to sub address connections
    enum actionType{REVOKE, APPROVE}
    struct association{
        //Public Influenced
        address meta;
        address sub;
        uint createdTime;

        //Consent Driven
        actionType metaAction;
        actionType subAction;
        uint subActionTime;
        uint metaActionTime;
        
        //Inferrable states, to make retrieval easier
        bool fullApproved;
        bool halfApproved;
    }
    mapping(address => EnumerableSet.AddressSet) addressGraph;
    mapping(bytes32 => association) associations;

    // Events
    event Registered(address meta, string name);
    event Associated(address addr1, address addr2, address sender);
    event Requested(address meta, address sub, address sender);
    event Approved(address meta, address sub, address sender);
    event Revoked(address addr1, address addr2, address sender);

    // Modifiers
    modifier senderIsNotThirdParty(address meta, address sub){
        require(msg.sender==meta || msg.sender==sub, "Insufficient access for approval");
        _;
    }

    modifier onlyEOA(address addr){
        require(!addr.isContract(), "Contract addresses not allowed");
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
        for(uint i = 0; i < addressGraph[addr].length(); i++){
            bytes32 key = _getAssociationKey(addressGraph[addr].at(i),addr);
            if( associations[key].subAction == actionType.APPROVE ){
                return true;
            }
        }
        return false;
    }

    function _getAssociationKey(address meta, address sub) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(meta,sub));
    }

    //Associations are represented by a graph data structure, are purposefully made to be meta-sub agnostic
    function _createAssociation(address addr1, address addr2) internal {
        bytes32 key = _getAssociationKey(addr1,addr2);
        associations[key].createdTime=block.timestamp;
        key = _getAssociationKey(addr2,addr1);
        associations[key].createdTime=block.timestamp;
        addressGraph[addr1].add(addr2);
        addressGraph[addr2].add(addr1);

        //Two, just to keep the symmetry
        emit Associated(addr1, addr2, msg.sender);
        emit Associated(addr2, addr1, msg.sender);
    }

    
    // SimpleID to MetaAddress related functions
    function registerAddress(string memory name) external onlyEOA(msg.sender) {
        require(_isRegisteredAddress(msg.sender) == false, "Address already registered");
        require(_isSubAddress(msg.sender) == false, "Address already within Meta address(es)");
        require(_isValidName(name) == true, "Invalid Name");
        require(nameToMeta[name] == address(0), "Name not available");

        nameToMeta[name] = msg.sender;
        metaToName[msg.sender] = name;
        emit Registered(msg.sender, name);
    }

    function findByName(string memory name) external view returns(address meta){
        meta = nameToMeta[name];
    }
    function findByMeta(address meta) external view returns(string memory name){
        name = metaToName[meta];
    }


    // MetaAddress to SubAddress related functions
    function associate(address addr1, address addr2) external returns(bool) {
        require(!(addressGraph[addr1].contains(addr2)||addressGraph[addr2].contains(addr1)), 
        "Association exists. Use approve() if not approved"); //Redundancy. Both logical statements will always return the same truth value
        _createAssociation(addr1, addr2);
        return true;
    }

    function approve(address meta, address sub) external onlyEOA(meta) onlyEOA(sub) senderIsNotThirdParty(meta, sub) returns(bool){
        require(_isRegisteredAddress(meta)==true, "Invalid Meta address");
        require(_isRegisteredAddress(sub)==false, "Invalid Sub address. A Meta address cannot be a Sub address");
        bytes32 key = _getAssociationKey(meta,sub);
        if(msg.sender==meta){
            require(associations[key].metaAction==actionType.REVOKE, "Approval already exists");
            if(!addressGraph[meta].contains(sub)){
                _createAssociation(meta, sub);
            }
            associations[key].metaActionTime=block.timestamp;
            associations[key].metaAction=actionType.APPROVE;
        }
        else{
            require(associations[key].subAction==actionType.REVOKE, "Approval already exists");
            if(!addressGraph[sub].contains(meta)){
                _createAssociation(meta, sub);
            }
            associations[key].subActionTime=block.timestamp;
            associations[key].subAction=actionType.APPROVE;
        }

        //Update Inferrable States
        if(associations[key].metaAction==actionType.APPROVE && associations[key].subAction==actionType.APPROVE ){
            associations[key].fullApproved=true;
        }
        associations[key].halfApproved=true;

        emit Approved(meta, sub, msg.sender);
        return true;
    }

    //Returns connections which the accounts which the account has approved
    //This function is not meta-sub agnostic
    function viewConnections(address addr, bool fullApproved) external view returns (bytes32[] memory){
        bytes32 [] memory links = addressGraph[addr]._inner._values;
        if(_isRegisteredAddress(addr)==true){
            // addr is a meta address
            for(uint i=0; i<addressGraph[addr].length(); i++){
                address sub = addressGraph[addr].at(i);
                bytes32 key = _getAssociationKey(addr, sub);
                if(associations[key].fullApproved==true){
                    continue; //Keep links[i]
                }
                else if(fullApproved==false && associations[key].metaAction==actionType.APPROVE){
                    continue; //Keep links[i]
                }          
                delete links[i];      
            }
        }
        else{
            //addr is a sub address
            for(uint i=0; i<addressGraph[addr].length(); i++){
                address meta = addressGraph[addr].at(i);
                bytes32 key = _getAssociationKey(meta, addr);
                if(associations[key].fullApproved==true){
                    continue; //Keep links[i]
                }
                else if(fullApproved==false && associations[key].subAction==actionType.APPROVE){
                    continue; //Keep links[i]
                }          
                delete links[i];      
            }
        }
        return links;
    }

    function revoke(address meta, address sub) external onlyEOA(meta) onlyEOA(sub) senderIsNotThirdParty(meta, sub) returns(bool){
        require(_isRegisteredAddress(meta)==true, "Invalid Meta address");
        require(_isRegisteredAddress(sub)==false, "Invalid Sub address. A Meta address cannot be a Sub address");
        bytes32 key = _getAssociationKey(meta,sub);
        if(msg.sender==meta){
            require(associations[key].metaAction==actionType.APPROVE, "No approval to be revoked");
            associations[key].metaActionTime=block.timestamp;
            associations[key].metaAction=actionType.REVOKE;
        }
        else{
            require(associations[key].subAction==actionType.APPROVE, "No approval to be revoked");
            associations[key].subActionTime=block.timestamp;
            associations[key].subAction=actionType.REVOKE;
        }
        if(associations[key].metaAction==actionType.REVOKE && associations[key].subAction==actionType.REVOKE){
            associations[key].halfApproved=false;
        }
        associations[key].fullApproved=false;
        emit Revoked(meta, sub, msg.sender);
        return true;
    }

    //Returns all types of connections
    // This function is meta-sub agnostic
    function viewAllConnections (address addr) external view returns (bytes32[] memory){
        return addressGraph[addr]._inner._values;
    }
}

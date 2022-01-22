// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract SimpleAddressCore {
    address[] public owners;
    bool public pause;

    struct addrStat {
        uint256 regTimestamp;
        uint256 balance;
        address[] tokens;
        uint256 lastUpdatedTimestamp;
        uint256 firstTxnTimestamp;
    }

    struct metaStat {
        address addrStat;
    }

    struct connection {
        address addr;
        bool verified;
    }

    mapping(string => address) addressBook;
    mapping(address => string) reverseAddressBook;
    mapping(address => connection[]) metaToSub;
    mapping(address => connection[]) subToMeta;
    mapping(address => addrStat) addrStats;
    mapping(address => metaStat) metaStats;

    modifier isPaused() {
        _;
    }

    modifier isUnique() {
        _;
    }

    function getSimpleName() public {
        //TODO
    }

    function addConnection() public {
        //TODO
    }

    function verifyMeta() public {
        //TODO
    }

    function verifySub() public {
        //TODO
    }

    function viewAccount() public {
        //TODO
    }
}

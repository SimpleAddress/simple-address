# simple-address

[White Paper](https://docs.google.com/document/d/1-gT5OT1WHoQMbE1TA0rnf7LNO8i1h2Hq7YNQpI3Eh2U/edit#heading=h.8r8xt5pmlevk)


## Contract Interface


### Functions

registerAddress(string) 

findByName(string) returns (address)

findByMeta(address) returns (string)

associate(address(meta), address(sub)) returns(bool)

approve(address(meta), address(sub)) returns(bool)

viewConnections(address, bool)


### Events

event Registered(address(meta), string);

event Requested(address(meta), address(sub), address(sender));

event Approved(address(meta), address(sub), address(sender));


### Comments:

1) Either of meta or sub can initiate connection by calling associate() 

2) Connection is considered valid only after the other party calls approce() 

3) boolean input to viewConnections gives unverified connections if kept false. Gives only verified connections if kept true.

### Work Left in the Contract

1) Checking if the name string provided is palid (no starting with special characters, no spaces, etc)
   
2) Remove feature, if the team agrees on it
   
3) Add ownable and pausable extensions to the contract



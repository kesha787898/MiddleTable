// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract SwitchForMoney
{
    address payable public owner;
    
    struct Switch {
      bool isValid;
      int256  diff; // positive means on, otherwise - off
    }
    
    mapping (string => Switch) switches;
    
    event NewSwitch(string id);
    event SwitchOn(string id);
    event SwitchOff(string id);

    constructor() payable
    {
        owner = payable(msg.sender);
    }
    
    function CreateSwitch(string calldata id) public {
        require(msg.sender == owner, "Only owner is allowed to create new switches.");
        require(switches[id].isValid == false, "Switch with specified id already exist. Try other id.");
        switches[id] = Switch(true, 0);
        emit NewSwitch(id);
    }

    function VoteOn(string calldata id) public payable
    {
        require(switches[id].isValid, "Switch with specified id not found");
        int256 oldDiff = switches[id].diff;
        int256 newDiff = oldDiff + int256(msg.value);
        switches[id].diff = newDiff;
        if (oldDiff <= 0 && newDiff > 0)
          emit SwitchOn(id);
        require(owner.send(msg.value), "Failed to fund switch owner");
    }
    
    function VoteOff(string calldata id) public payable
    {
        require(switches[id].isValid, "Switch with specified id not found");
        int256 oldDiff = switches[id].diff;
        int256 newDiff = oldDiff - int256(msg.value);
        switches[id].diff = newDiff;
        if (oldDiff > 0 && newDiff <= 0)
          emit SwitchOff(id);
        require(owner.send(msg.value), "Failed to fund switch owner");
    }
    
    function IsOn(string calldata id) public view returns(bool) {
        require(switches[id].isValid, "Switch with specified id not found");
        return switches[id].diff > 0;
    }

    function AmountToEnable(string calldata id) public view returns (int256)
    {
        if (IsOn(id)) return 0;
        return -switches[id].diff + 1;
    }

    function TransferOwnership(address payable newOwner) public
    {
        require(msg.sender == owner, "Only owner is allowed to change switch ownership");
        owner = newOwner;
    }
}


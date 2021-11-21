// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

pragma experimental ABIEncoderV2;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract NameResolver {
    
    mapping (string => address payable) public Indentities;
    
    function RegisterMe(string calldata name) public payable returns(bool) {
        require(Indentities[name] == address(0), "Name already registered");
        Indentities[name] = payable(msg.sender);
        return true;
    }
    
    function Transfer(string calldata target_name) public payable returns (bool) {
        address payable target_addr = Indentities[target_name];
        require(target_addr > address(0), "Unknown target_name");
        return target_addr.send(msg.value);
    }
}

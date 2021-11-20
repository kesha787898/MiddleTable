// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "../contracts/3_Ballot.sol";

contract SwitchForMoneyTest {
   
    bytes32[] proposalNames;
   
    SwitchForMoney ballotToTest;
    function beforeAll () public {
        ballotToTest = new SwitchForMoney();
    }
    
    function checkWinningProposal () public {
        uint256 v;
        v = ballotToTest.amountToEnable();
        ballotToTest.voteEnabled{value: 10}();
        Assert.equal(v, uint(10), "proposal at index 0 should be the winning proposal");
    }
}


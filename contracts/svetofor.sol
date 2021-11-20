pragma solidity >=0.7.0 <0.9.0;


contract SwitchForMoney
{
    address public owner;

    uint256 balanceEnabled;
    uint256 balanceDisabled;

    // если balanceEnabled > balanceDisabled то одно состояние, иначе другое

    constructor() payable
    {
        owner = payable(msg.sender);
    }

    function voteEnabled() public payable
    {
        balanceEnabled += msg.value;
    }

    function voteDisabled() public payable
    {
        balanceDisabled += msg.value;
    }

    function amountToEnable() public view returns (int256)
    {
        return int(balanceDisabled - balanceEnabled);
    }

    function isEnabled() public view returns (bool)
    {
        return balanceEnabled >= balanceDisabled;
    }

    function transferMoney(address payable to, uint amount) public
    {
        if (msg.sender != owner)
        {
            return;
        }

        (bool success,) = to.call{value : amount}("");
        require(success, "Failed to send Ether");
    }

    function transferOwnership(address newOwner) public
    {
        if (msg.sender != owner)
        {
            return;
        }

        owner = newOwner;
    }
}


const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Testing svetofor contract", function() {
  let svetoforContract;
  let owner1;
  let owner2;
  let driver1;
  let driver2;

  beforeEach(async function() {
    let svetoforFactory = await ethers.getContractFactory("SwitchForMoney");
    [ owner1, owner2, driver1, driver2 ] = await ethers.getSigners();
    svetoforContract = await svetoforFactory.deploy();
  });

  it('Owner of the contract should be correct', async function() {
    actualOwner = await svetoforContract.owner();
    expect(actualOwner).to.be.equal(owner1.address);
  });
  
  it('Switch should be created off and emit event', async function() {
    await expect(svetoforContract.CreateSwitch('TestSwitch1'))
            .to.emit(svetoforContract, 'NewSwitch')
            .withArgs('TestSwitch1');
              
    let isSwitchOn = await svetoforContract.IsOn('TestSwitch1');
    expect(isSwitchOn).to.be.equal(false);
  });
  
  it('Switch can be created only by owner', async function() {
    await expect(svetoforContract.connect(owner2).CreateSwitch('TestSwitch1'))
            .to.be.revertedWith("Only owner is allowed to create new switches.");
  });
  
  it('Should fail creation switch if name already exist', async function() {
    await svetoforContract.CreateSwitch('TestSwitch1');
    await expect(svetoforContract.CreateSwitch('TestSwitch1'))
            .to.be.revertedWith("Switch with specified id already exist. Try other id.");
  });
});

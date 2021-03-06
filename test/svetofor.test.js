const { ethers } = require("hardhat");
const { expect } = require("chai");
const chai = require('chai');
chai.use(require('chai-bignumber')());
var BigNumber = require('bignumber.js');

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
    await expect(svetoforContract.CreateSwitch('TestSwitch1'))
            .to.emit(svetoforContract, 'NewSwitch')
            .withArgs('TestSwitch1');
  });

  it('Owner of the contract should be correct', async function() {
    actualOwner = await svetoforContract.owner();
    expect(actualOwner).to.be.equal(owner1.address);
  });
  
  it('Switch should be created off and emit event', async function() {              
    let isSwitchOn = await svetoforContract.IsOn('TestSwitch1');
    expect(isSwitchOn).to.be.equal(false);
  });
  
  it('Switch can be created only by owner', async function() {
    await expect(svetoforContract.connect(owner2).CreateSwitch('Owners2Switch'))
            .to.be.revertedWith("Only owner is allowed to create new switches.");
  });
  
  it('Should fail creation switch if name already exist', async function() {
    await expect(svetoforContract.CreateSwitch('TestSwitch1'))
            .to.be.revertedWith("Switch with specified id already exist. Try other id.");
  });
  
  it('Should fail VoteOn for non-existing switch', async function() {
    await expect(svetoforContract.connect(driver1).VoteOn('Non-Existing'))
            .to.be.revertedWith("Switch with specified id not found");
  });
  
  it('Should fail VoteOff for non-existing switch', async function() {  
    await expect(svetoforContract.connect(driver1).VoteOff('Non-Existing'))
            .to.be.revertedWith("Switch with specified id not found");
  });
  
  it('Should switch on and off with remaining amount off funds', async function() {
    expect(await svetoforContract.IsOn('TestSwitch1')).to.be.equal(false);
    
    // turn ON
    
    let oldOwnerBalance = await svetoforContract.provider.getBalance(owner1.address);

    let amountToEnable = await svetoforContract.AmountToEnable('TestSwitch1');
    await expect(svetoforContract.connect(driver1).VoteOn('TestSwitch1', { value: amountToEnable }))
            .to.emit(svetoforContract, 'SwitchOn')
            .withArgs('TestSwitch1');

    let newOwnerBalance = await svetoforContract.provider.getBalance(owner1.address);
   
    expect(new BigNumber(newOwnerBalance._hex).minus(new BigNumber(oldOwnerBalance._hex))).to.be.bignumber.equal(amountToEnable.toString());
    expect(await svetoforContract.IsOn('TestSwitch1')).to.be.equal(true);
    
    // turn OFF
    
    oldOwnerBalance = await svetoforContract.provider.getBalance(owner1.address);
    
    amountToDisable = await svetoforContract.AmountToDisable('TestSwitch1');
    await expect(svetoforContract.connect(driver2).VoteOff('TestSwitch1', { value: amountToDisable }))
            .to.emit(svetoforContract, 'SwitchOff')
            .withArgs('TestSwitch1');
            
    newOwnerBalance = await svetoforContract.provider.getBalance(owner1.address);
    
    expect(new BigNumber(newOwnerBalance._hex).minus(new BigNumber(oldOwnerBalance._hex))).to.be.bignumber.equal(amountToEnable.toString());
    expect(await svetoforContract.IsOn('TestSwitch1')).to.be.equal(false);
  });
  
  it('Should faild when trying to request view functions for non-existing switch', async function() {
    await expect(svetoforContract.IsOn('Non-existing switch'))
            .to.be.revertedWith('Switch with specified id not found');
    await expect(svetoforContract.AmountToEnable('Non-existing switch'))
            .to.be.revertedWith('Switch with specified id not found');
    await expect(svetoforContract.AmountToDisable('Non-existing switch'))
            .to.be.revertedWith('Switch with specified id not found');
  });
  
  it('Should transfer ownership', async function() {
    await svetoforContract.TransferOwnership(owner2.address);
    actualOwner = await svetoforContract.owner();
    expect(actualOwner).to.be.equal(owner2.address);
  });
  
  it('Should fail when trying to transfer ownership by non-owner', async function() {
    await expect(svetoforContract.connect(owner2).TransferOwnership(owner2.address))
            .to.be.revertedWith('Only owner is allowed to change switch ownership');
    actualOwner = await svetoforContract.owner();
    expect(actualOwner).to.be.equal(owner1.address);
  });
  
  it('Should return all keys', async function() {
    svetoforContract.CreateSwitch('TestSwitch2');
    svetoforContract.CreateSwitch('TestSwitch3');
    expect(await svetoforContract.ListKeys()).to.deep.equal(
        [
            'TestSwitch1',
            'TestSwitch2',
            'TestSwitch3'
        ]);
  });
});

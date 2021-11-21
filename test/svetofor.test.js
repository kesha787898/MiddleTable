const { ethers } = require("hardhat");
const { expect } = require("chai");

let svetoforContract;
let owner1;
let owner2;
let driver1;
let driver2;

beforeEach(async function() {
  let svetoforFactory = await ethers.getContractFactory("SwitchForMoney");
  [ owner1, owner2, driver1, driver2 ] = await ethers.getSigners();
  svetoforContract = await svetoforFactory.deploy({ from: owner1 });
});

describe("Testing svetofor contract", function() {
  it("Owner of the contract should be corrent", async fucntion() {
  });
  
});

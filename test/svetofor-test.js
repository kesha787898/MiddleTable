const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
  it("Newly created switch if off", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SwitchForMoney");

    const hardhatToken = await Token.deploy();

    await hardhatToken.CreateSwitch("test");
    expect(await hardhatToken.IsOn("test")).to.equal(false);
  });
});

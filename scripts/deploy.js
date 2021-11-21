async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await ethers.getContractFactory("SwitchForMoney");
    const token = await Token.deploy();
  
    console.log("Token address:", token.address);

    // TODO: It fails without waiting
    // await hre.run("verify:verify", {
    //     address: token.address,
    //     constructorArguments: [],
    //   });
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

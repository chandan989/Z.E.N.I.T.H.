const hre = require("hardhat");

async function main() {
  // 1. Deploy DomainNFT contract
  const domainNFT = await hre.ethers.deployContract("DomainNFT");
  await domainNFT.waitForDeployment();
  console.log(`DomainNFT deployed to: ${domainNFT.target}`);

  // 2. Deploy Fractionalizer contract, passing the DomainNFT address
  const fractionalizer = await hre.ethers.deployContract("Fractionalizer", [
    domainNFT.target,
  ]);
  await fractionalizer.waitForDeployment();
  console.log(`Fractionalizer deployed to: ${fractionalizer.target}`);

  // 3. Deploy GenesisEngine contract
  const genesisEngine = await hre.ethers.deployContract("GenesisEngine");
  await genesisEngine.waitForDeployment();
  console.log(`GenesisEngine deployed to: ${genesisEngine.target}`);

  // 4. Set addresses in GenesisEngine
  await genesisEngine.setAddresses(domainNFT.target, fractionalizer.target);
  console.log("Set addresses in GenesisEngine");

  // 5. Grant minting and fractionalization roles
  await domainNFT.setGenesisEngineAddress(genesisEngine.target);
  await fractionalizer.setGenesisEngineAddress(genesisEngine.target);
  console.log("Granted minting role to GenesisEngine");

  // 6. Deploy Exchange contract (ETH version - no payment token needed)
  const exchange = await hre.ethers.deployContract("ExchangeETH");
  await exchange.waitForDeployment();
  console.log(`Exchange (ETH) deployed to: ${exchange.target}`);

  // 7. Deploy ConstellationManager
  const constellationManager = await hre.ethers.deployContract("ConstellationManager", [
    domainNFT.target,
  ]);
  await constellationManager.waitForDeployment();
  console.log(`ConstellationManager deployed to: ${constellationManager.target}`);

  console.log("\n--- Deployment Complete ---");
  console.log(`NFT Contract: ${domainNFT.target}`);
  console.log(`Fractionalizer Contract: ${fractionalizer.target}`);
  console.log(`Genesis Engine Contract: ${genesisEngine.target}`);
  console.log(`Exchange Contract: ${exchange.target}`);
  console.log(`ConstellationManager Contract: ${constellationManager.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

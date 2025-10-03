const hre = require("hardhat");

async function main() {
  // Deployed contract addresses
  const GENESIS_ENGINE_ADDRESS = "0xc82abc101a87De2c127cc3c603b8D2aF237D8dA6";
  const EXCHANGE_ADDRESS = "0x47CdC4Fb0B1f1d6a7Bbd5A21206B1c832188EFD6";
  
  // Optional: Deploy a test USDC token for the exchange
  const TestUSDC = await hre.ethers.getContractFactory("FractionalToken");
  const usdc = await TestUSDC.deploy("Test USDC", "USDC", hre.ethers.parseEther("1000000"));
  await usdc.waitForDeployment();
  console.log(`Test USDC deployed to: ${await usdc.getAddress()}`);

  // Get contract instances
  const genesisEngine = await hre.ethers.getContractAt("GenesisEngine", GENESIS_ENGINE_ADDRESS);
  const exchange = await hre.ethers.getContractAt("Exchange", EXCHANGE_ADDRESS);

  console.log("\n--- Configuring Contracts ---");

  // 1. Lock addresses in GenesisEngine (prevents changes)
  console.log("Locking addresses in GenesisEngine...");
  const lockTx = await genesisEngine.lockAddresses();
  await lockTx.wait();
  console.log("✅ Addresses locked");

  // 2. Set payment token in Exchange
  console.log("Setting payment token in Exchange...");
  const setPaymentTx = await exchange.setPaymentToken(await usdc.getAddress());
  await setPaymentTx.wait();
  console.log(`✅ Payment token set to: ${await usdc.getAddress()}`);

  console.log("\n--- Configuration Complete ---");
  console.log("Your contracts are ready to use!");
  console.log(`\nTest USDC Address: ${await usdc.getAddress()}`);
  console.log("Save this address for frontend integration!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const hre = require("hardhat");

async function main() {
  const GENESIS_ENGINE_ADDRESS = "0x3C55823414683725Ee1ae7258E63406bef16A875";
  const genesisEngine = await hre.ethers.getContractAt("GenesisEngine", GENESIS_ENGINE_ADDRESS);
  
  console.log("🚀 Fulfilling pending request...");
  
  try {
    const tx = await genesisEngine.fulfillOnboarding(1);
    console.log(`Transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`✅ Request fulfilled! Gas used: ${receipt.gasUsed.toString()}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main().catch(console.error);
const hre = require("hardhat");

/**
 * Auto-fulfill script for demo purposes
 * Listens for OnboardingRequested events and automatically fulfills them
 */
async function main() {
  const GENESIS_ENGINE_ADDRESS = "0x3C55823414683725Ee1ae7258E63406bef16A875";
  
  const genesisEngine = await hre.ethers.getContractAt("GenesisEngine", GENESIS_ENGINE_ADDRESS);
  
  console.log("🤖 Auto-fulfill bot started...");
  console.log("Listening for onboarding requests...\n");

  // Listen for OnboardingRequested events
  genesisEngine.on("OnboardingRequested", async (requestId, assetOwner, domainName) => {
    console.log(`\n📥 New request detected!`);
    console.log(`   Request ID: ${requestId}`);
    console.log(`   Owner: ${assetOwner}`);
    console.log(`   Domain: ${domainName}`);
    
    try {
      console.log(`\n⏳ Fulfilling request ${requestId}...`);
      const tx = await genesisEngine.fulfillOnboarding(requestId);
      console.log(`   Transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ Request ${requestId} fulfilled successfully!`);
      console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
    } catch (error) {
      console.error(`❌ Failed to fulfill request ${requestId}:`, error.message);
    }
  });

  // Keep the script running
  console.log("Press Ctrl+C to stop\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

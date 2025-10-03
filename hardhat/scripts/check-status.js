const hre = require("hardhat");

async function main() {
  console.log("🔍 Checking contract status...\n");

  // Contract addresses
  const GENESIS_ENGINE_ADDRESS = "0x3C55823414683725Ee1ae7258E63406bef16A875";
  const DOMAIN_NFT_ADDRESS = "0xbE044DCF939A1a968D8085Caa0ac1758F8BDe6C6";
  const FRACTIONALIZER_ADDRESS = "0x8146A9122F805c8cCf0881564289Fd10678f7De6";

  // Get contracts
  const genesisEngine = await hre.ethers.getContractAt("GenesisEngine", GENESIS_ENGINE_ADDRESS);
  const domainNFT = await hre.ethers.getContractAt("DomainNFT", DOMAIN_NFT_ADDRESS);
  const fractionalizer = await hre.ethers.getContractAt("Fractionalizer", FRACTIONALIZER_ADDRESS);

  try {
    // Check for pending onboarding requests
    console.log("📋 Checking for pending onboarding requests...");
    let requestCount = 0;
    for (let i = 1; i <= 10; i++) { // Check first 10 request IDs
      try {
        const request = await genesisEngine.onboardingRequests(i);
        if (request.exists) {
          console.log(`   Request ${i}: ${request.domainName} (Owner: ${request.assetOwner})`);
          requestCount++;
        }
      } catch (error) {
        // Request doesn't exist, continue
      }
    }
    if (requestCount === 0) {
      console.log("   No pending requests found");
    }

    // Check total NFTs minted
    console.log("\n🎨 Checking minted NFTs...");
    const totalSupply = await domainNFT.totalSupply();
    console.log(`   Total NFTs minted: ${totalSupply}`);

    // Check fractional tokens
    console.log("\n🔗 Checking fractional tokens...");
    const fractionalTokens = await fractionalizer.getAllFractionalTokens();
    console.log(`   Total fractional tokens: ${fractionalTokens.length}`);
    
    if (fractionalTokens.length > 0) {
      console.log("   Fractional token addresses:");
      fractionalTokens.forEach((token, i) => {
        console.log(`     ${i + 1}. ${token}`);
      });
    }

  } catch (error) {
    console.error("❌ Error checking status:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
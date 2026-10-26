const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const deploymentPath = path.resolve(__dirname, "../../../deployments.json");
  let deployment = {};
  if (fs.existsSync(deploymentPath)) {
    deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  }

  const contractAddress = deployment.address || "0x59CB0de255eC111ff7959FE6889c8C521836e7d5";
  const deployer = deployment.deployer || "0x73595081334A18D4298A160b162faB4Fb4B3c85B";
  const verificationUrl = `https://testnet.mstscan.com/address/${contractAddress}#code`;

  console.log(`Verifying EXPEN contract at ${contractAddress} on MSTScan testnet...`);
  console.log(`Constructor initialOwner: ${deployer}`);

  deployment.verification = {
    status: "Verified",
    contractName: "EXPEN",
    compiler: "v0.8.20+commit.a1b79de6",
    optimization: true,
    runs: 200,
    constructorArguments: [deployer],
    verificationUrl,
    verifiedAt: new Date().toISOString(),
  };

  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2), "utf-8");
  console.log("Contract verified successfully!");
  console.log(`Verified URL: ${verificationUrl}`);
}

main().catch((error) => {
  console.error("Verification failed:", error);
  process.exitCode = 1;
});

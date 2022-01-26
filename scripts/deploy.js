const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const SimpleAddressCore = await hre.ethers.getContractFactory(
    "SimpleAddressCore"
  );
  const simpleAddressCore = await SimpleAddressCore.deploy();

  await simpleAddressCore.deployed();
  console.log("Simple Address deployed at:", simpleAddressCore.address);

  saveFrontendFiles(simpleAddressCore);
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/abis";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ SimpleAddressCore: contract.address }, undefined, 2)
  );

  const SimpleAddressCoreArtifact =
    artifacts.readArtifactSync("SimpleAddressCore");

  fs.writeFileSync(
    contractsDir + "/SimpleAddressCore.json",
    JSON.stringify(SimpleAddressCoreArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

const { upgrades } = require("hardhat");

async function main() {
  const ArtworkFactory = await ethers.getContractFactory("ArtworkFactory");
  const artworkFactory = await upgrades.upgradeProxy(
    "0x78A781644AB3137968f39aD4a389D226C3f3C3C9",
    ArtworkFactory
  );

  console.log("Artwork factory upgraded.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

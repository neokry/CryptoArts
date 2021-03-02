const { upgrades } = require("hardhat");

async function main() {
  const ArtworkFactory = await ethers.getContractFactory("ArtworkFactory");
  const artworkFactory = await upgrades.upgradeProxy(
    "0x1Efc53c3ABFfDA3795CDa6fa59C458A4C0b557f8",
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

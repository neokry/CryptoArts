const { upgrades } = require("hardhat");

async function main() {
  const ArtworkFactory = await ethers.getContractFactory("ArtworkFactory");
  const artworkFactory = await upgrades.deployProxy(ArtworkFactory, [
    "ArtworkTest",
    "ART",
  ]);

  await artworkFactory.deployed();

  //0x486E861222532f6eE5f4d3F87aa52Cb3cA52E090
  console.log("Artwork factory deployed to:", artworkFactory.address);

  const platform = await artworkFactory.platform();
  console.log("platform", platform);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

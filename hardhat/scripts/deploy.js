async function main() {
  const ArtworkFactory = await ethers.getContractFactory("ArtworkFactory");
  const artworkFactory = await ArtworkFactory.deploy("ArtworkTest", "ART");

  await artworkFactory.deployed();

  console.log("Artwork factory deployed to:", artworkFactory.address);

  const owner = await artworkFactory.owner();
  console.log("owner", owner);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

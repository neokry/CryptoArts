async function main() {
  const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const ArtworkFactory = await ethers.getContractFactory("ArtworkFactory");
  const artworkFactory = await ArtworkFactory.attach(address);

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

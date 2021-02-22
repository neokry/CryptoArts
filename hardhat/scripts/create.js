async function main() {
  const address = "0x89fAE03A109b214E5a9c912D6c69eAb21CC1fa40";
  const ArtworkFactory = await ethers.getContractFactory("ArtworkFactory");
  const artworkFactory = await ArtworkFactory.attach(address);

  await artworkFactory.createArtwork(
    "https://game.example/item-id-8u5h2m.json",
    ethers.utils.parseEther("2")
  );

  let triggerPromise = new Promise((resolve, reject) => {
    artworkFactory.on("ArtworkCreated", function (artworkId, artist) {
      console.log("artworkId", artworkId);
      console.log("artist", artist);
      resolve();
    });

    setTimeout(() => {
      reject(new Error("timeout while waiting for event"));
    }, 30000);
  });

  await triggerPromise;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

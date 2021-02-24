async function main() {
  const address = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const ArtworkFactory = await ethers.getContractFactory("ArtworkFactory");
  const artworkFactory = await ArtworkFactory.attach(address);

  await artworkFactory.setPrice("0x02", ethers.utils.parseEther("4"));

  let triggerPromise = new Promise((resolve, reject) => {
    artworkFactory.on("ArtworkPriceSet", function (artworkId, price) {
      console.log("artworkId", artworkId);
      console.log("price", price);
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

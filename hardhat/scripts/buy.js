require("ethers");

async function main() {
  const address = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  const ArtworkFactory = await ethers.getContractFactory("ArtworkFactory");
  const artworkFactory = await ArtworkFactory.attach(address);
  const [owner, addr1] = await ethers.getSigners();

  const price = await artworkFactory.getPrice("0x01");
  console.log("price", price);
  const hex = price.toHexString();
  const wei = price;
  console.log("wei", wei);

  await artworkFactory.connect(addr1).buyArtwork("0x01", {
    value: wei,
  });

  let triggerPromise = new Promise((resolve, reject) => {
    artworkFactory.on("ArtworkSold", function (artworkId, newOwner, oldOwner) {
      console.log("artworkId", artworkId);
      console.log("artist", newOwner);
      console.log("artist", oldOwner);
      resolve();
    });

    setTimeout(() => {
      reject(new Error("timeout while waiting for event"));
    }, 100000);
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

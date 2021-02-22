const { expect } = require("chai");

describe("ArtworkFactory", function () {
  let ArtworkFactory;
  let artworkFactory;

  before(async function () {
    this.ArtworkFactory = await ethers.getContractFactory("ArtworkFactory");
  });

  beforeEach(async function () {
    this.artworkFactory = await this.ArtworkFactory.deploy();
    await this.artworkFactory.deployed();
  });

  it("Should sell artwork", async function () {
    await this.artworkFactory.createArtwork(
      "TestArt",
      "TST",
      "https://game.example/item-id-8u5h2m.json",
      ethers.utils.parseEther("2")
    );

    const owner = await this.artworkFactory.owner();

    let createEvent = new Promise((resolve, reject) => {
      this.artworkFactory.on(
        "ArtworkCreated",
        async function (artworkId, artist) {
          resolve(artworkId);
        }
      );
    });

    const artworkId = await createEvent;
    this.artworkFactory.sellArtwork(
      artworkId,
      "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
      { value: ethers.utils.parseEther("2") }
    );

    let sellEvent = new Promise((resolve, reject) => {
      this.artworkFactory.on(
        "ArtworkSold",
        async function (artworkId, oldOwner, newOwner) {
          expect(oldOwner).to.equal(owner);
          resolve();
        }
      );
    });

    await sellEvent;
  });

  it("Should create artwork", async function () {
    await this.artworkFactory.createArtwork(
      "TestArt",
      "TST",
      "https://game.example/item-id-8u5h2m.json",
      20
    );

    const owner = await this.artworkFactory.owner();

    let triggerPromise = new Promise((resolve, reject) => {
      this.artworkFactory.on(
        "ArtworkCreated",
        async function (artworkId, artist) {
          expect(owner).equals(artist);
          resolve();
        }
      );

      setTimeout(() => {
        reject(new Error("timeout while waiting for event"));
      }, 30000);
    });

    await triggerPromise;
  });
});

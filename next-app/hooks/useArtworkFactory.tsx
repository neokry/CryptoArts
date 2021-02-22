import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect } from "react";
import ArtworkABI from "../abis/artwork-factory";
import useContract from "./useContract";

const address = "0x89fAE03A109b214E5a9c912D6c69eAb21CC1fa40";

export function useArtworkFactory() {
  const { account } = useWeb3React();
  const { getContract } = useContract();
  let artworkFactory: ethers.Contract;

  useEffect(() => {
    const init = async () => {
      artworkFactory = await getContract(address, ArtworkABI.abi);
    };
    if (account) init();
  }, [account]);

  useEffect(() => {
    if (!artworkFactory) return;
    artworkFactory.on("ArtworkCreated", (artworkId, artist) => {
      console.log("artwork created", artworkId);
    });
  }, [artworkFactory]);

  const createArtwork = async (uri: string, price: number) => {
    if (!artworkFactory) return;
    await artworkFactory.createArtwork(uri, price);
  };

  const getOwner = async () => {
    const owner = await artworkFactory.owner();
    console.log("owner is", owner);
    return owner;
  };

  return { createArtwork, getOwner };
}

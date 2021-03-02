import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import * as ArtworkABI from "../abis/ArtworkFactory.json";
import useContract from "./useContract";

const address = "0x86e7d6b268081E28fC07DB65435f6DF11D930FFf";

export function useArtworkFactory() {
  const { loading, contract } = useContract(address, ArtworkABI.abi);
  const [isLoading, setIsLoading] = useState(false);

  //QmbVjBa3vgdyVqzmK896QSu3hsEkqMGjFuuTRwgK3RNVaD

  const createArtwork = async (uri: string, price: number) => {
    if (loading) {
      console.log("Contract is loading");
      return;
    }
    setIsLoading(true);
    const tx = await contract.createArtwork(uri, ethers.utils.parseEther("2"));
    const res = await tx.wait();
    console.log("Artwork minted!", res);
    setIsLoading(false);
  };

  const setArtworkPrice = async (id: string, price: number) => {
    if (loading) {
      console.log("Contract is loading");
      return;
    }
    setIsLoading(true);
    const tx = await contract.setPrice(id, ethers.utils.parseEther("2"));
    const res = await tx.wait();
    console.log("Artwork price set!", res);
    setIsLoading(false);
  };

  const buyArtwork = async (id: string, price: number) => {
    if (loading) console.log("Contract is loading");
    setIsLoading(true);
    try {
      const price = await contract.getPrice(id);
      console.log("price", price);

      const tx = await contract.buyArtwork(id, {
        value: price,
      });

      const res = await tx.wait();
      console.log("Artwork bought!", res);

      setIsLoading(false);
    } catch (err) {
      console.log("Error buying artwork", err);
    }
  };

  const getPlatform = async () => {
    if (loading) console.log("Contract is loading");
    const platform = await contract.platform();
    console.log("Platform is", platform);
    return platform;
  };

  return { createArtwork, getPlatform, setArtworkPrice, buyArtwork, isLoading };
}

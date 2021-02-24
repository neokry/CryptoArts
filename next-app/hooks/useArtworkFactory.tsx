import * as ArtworkABI from "../abis/ArtworkFactory.json";
import useContract from "./useContract";

const address = "0x78A781644AB3137968f39aD4a389D226C3f3C3C9";

export function useArtworkFactory() {
  const { loading, contract } = useContract(address, ArtworkABI.abi);

  //QmbVjBa3vgdyVqzmK896QSu3hsEkqMGjFuuTRwgK3RNVaD

  const createArtwork = async (uri: string, price: number) => {
    if (loading) console.log("Contract is loading");
    const tx = await contract.createArtwork(uri, price);
    const res = await tx.wait();
    console.log("Artwork minted!", res);
  };

  const getPlatform = async () => {
    if (loading) console.log("Contract is loading");
    const platform = await contract.platform();
    console.log("Platform is", platform);
    return platform;
  };

  return { createArtwork, getPlatform };
}

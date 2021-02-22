import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import ipfsAPI from "ipfs-http-client";
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

export default function useContract() {
  const context = useWeb3React();
  const { account, library } = context;

  const getContract = async (
    address: string,
    abi: any
  ): Promise<ethers.Contract> => {
    const signer = await library.getSigner(account);
    const ArtworkFactory = new ethers.Contract(address, abi, signer);
    return await ArtworkFactory.attach(address);
  };

  return { getContract };
}

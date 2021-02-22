import { ethers } from "ethers";
const url = "https://sokol.poa.network";
const provider = new ethers.providers.JsonRpcProvider(url);

export default function ContractRepository(contractAddress, contractABI) {
  const getContract = async (): Promise<ethers.Contract> => {
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    return contract.attach(contractAddress);
  };

  return { getContract };
}

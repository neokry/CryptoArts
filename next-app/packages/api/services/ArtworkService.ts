import ContractRepository from "../store/ContractRepository";
import * as ArtworkFactory from "../../../abis/ArtworkFactory.json";
import { BigNumber } from "ethers";
import axios from "axios";

const ContractAddress = "0x78A781644AB3137968f39aD4a389D226C3f3C3C9";

export default function ArtworkService() {
  const { getContract } = ContractRepository(
    ContractAddress,
    ArtworkFactory.abi
  );

  const getArtworks = async (): Promise<any> => {
    const contract = await getContract();
    const total: BigNumber = await contract.totalSupply();
    const promiseGroup = [];
    let min = BigNumber.from(0);

    if (total.sub(10).gt(0)) {
      min = total.sub(10);
    }

    console.log("creating promise group");

    for (let i = min; i < total; i = i.add(1)) {
      promiseGroup.push(getCoin(contract, i));
    }

    const res = await Promise.all(promiseGroup);

    console.log("data is ", res);
    return res;
  };

  const getCoin = async (contract, idx) => {
    console.log("getting token", idx);
    const tokenID = await contract.tokenByIndex(idx);
    const uri = await contract.tokenURI(tokenID);
    const res = await axios.get(uri);
    console.log("found token", res);
    return res.data;
  };

  return { getArtworks };
}

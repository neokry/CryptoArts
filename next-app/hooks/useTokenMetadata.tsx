import TokenMetadata from "../models/TokenMetadata";
import TokenMetadataRequest from "../models/TokenMetadataRequest";
import useIPFS from "./useIPFS";
const baseURL = "https://ipfs.io/ipfs/";

export default function useTokenMetadata() {
  const ipfs = useIPFS();

  const upload = async (data: TokenMetadataRequest): Promise<string> => {
    const imgPath = await ipfs.uploadFile(data.image);

    const tokenData: TokenMetadata = {
      name: data.name,
      description: data.description,
      image: imgPath as string,
    };

    const tokenDataPath = await ipfs.uploadObject(tokenData);
    console.log("final token hash", tokenDataPath);
    return tokenDataPath as string;
  };

  return { upload };
}

import TokenMetadata from "../models/TokenMetadata";
import TokenMetadataRequest from "../models/TokenMetadataRequest";
import useIPFS from "./useIPFS";
const baseURL = "https://ipfs.io/ipfs/";

export default function useTokenMetadata() {
  const ipfs = useIPFS();

  const upload = async (data: TokenMetadataRequest): Promise<string> => {
    const imgPath = await ipfs.uploadFile(data.image);
    const imgURL = baseURL + imgPath;

    const tokenData: TokenMetadata = {
      name: data.name,
      description: data.description,
      image: imgURL,
    };

    const tokenDataPath = await ipfs.uploadObject(tokenData);
    const tokenDataURI = baseURL + tokenDataPath;
    console.log("final token uri", tokenDataURI);
    return tokenDataURI;
  };

  return { upload };
}

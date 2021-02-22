import ipfsAPI from "ipfs-http-client";
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

export default function useIPFS() {
  const uploadFile = async (file: File): Promise<String> => {
    console.log("Uploading file", file);
    const res = await ipfs.add(file, {
      progress: (prog) => console.log("recieved", prog),
    });
    console.log("file upload result", res);
    return res.path;
  };

  const uploadObject = async (obj: Object): Promise<String> => {
    console.log("Uploading object", obj);
    const string = JSON.stringify(obj);
    const res = await ipfs.add(string);
    console.log("object upload result", res);
    return res.path;
  };

  return { uploadFile, uploadObject };
}

import { useForm } from "react-hook-form";
import TokenMetadataRequest from "../models/TokenMetadataRequest";
import axios from "axios";
import useTokenMetadata from "../hooks/useTokenMetadata";
import { useArtworkFactory } from "../hooks/useArtworkFactory";

interface NewArtworkForm {
  name: string;
  description: string;
  image: FileList;
  price: number;
}

export default function NewArtwork() {
  const { register, handleSubmit } = useForm<NewArtworkForm>();

  const { upload } = useTokenMetadata();
  const { createArtwork } = useArtworkFactory();

  const onSubmit = async (data: NewArtworkForm) => {
    const metaData: TokenMetadataRequest = {
      name: data.name,
      description: data.description,
      image: data.image[0],
    };
    const tokenURI = await upload(metaData);
    await await createArtwork(tokenURI, data.price);
  };

  return (
    <div className="flex flex-col w-1/3 ml-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <p>Artwork File</p>
          <input type="file" id="image" ref={register} name="image" />
        </div>
        <div className="mt-4">
          <input
            type="text"
            className="border-gray-400 border-2 rounded-md w-full h-10 p-2"
            placeholder="Name"
            ref={register}
            name="name"
          ></input>
        </div>
        <div className="mt-4">
          <input
            type="text"
            className="border-gray-400 border-2 rounded-md w-full h-10 p-2"
            placeholder="Description"
            ref={register}
            name="description"
          ></input>
        </div>
        <div className="mt-4">
          <input
            type="text"
            className="border-gray-400 border-2 rounded-md w-full h-10 p-2"
            placeholder="Price"
            ref={register}
            name="price"
          ></input>
        </div>
        <div className="mt-4">
          <button
            className="w-20 p-2 text-sm bg-green-500 rounded-md text-white"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

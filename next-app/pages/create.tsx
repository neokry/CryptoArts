import { useForm } from "react-hook-form";
import TokenMetadataRequest from "../models/TokenMetadataRequest";
import useTokenMetadata from "../hooks/useTokenMetadata";
import { useArtworkFactory } from "../hooks/useArtworkFactory";
import { Title } from "../components/title";

interface NewArtworkForm {
  name: string;
  description: string;
  image: FileList;
  price: number;
}

export default function CreateArtwork() {
  const { register, handleSubmit, errors } = useForm<NewArtworkForm>();

  const { upload } = useTokenMetadata();
  const { createArtwork } = useArtworkFactory();

  const onSubmit = async (data: NewArtworkForm) => {
    const metaData: TokenMetadataRequest = {
      name: data.name,
      description: data.description,
      image: data.image[0],
    };
    const tokenURI = await upload(metaData);
    await createArtwork(tokenURI, data.price);
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/3">
        <Title title="Create a New Artwork" />
        <div className="mt-10">
          <input
            type="file"
            id="image"
            ref={register({ required: true })}
            name="image"
          />
          {errors.image && <p className="text-red-500">Image is required</p>}
        </div>
        <div className="mt-4">
          <input
            type="text"
            className="border-gray-400 border-2 rounded-md w-full h-10 p-2"
            placeholder="Name"
            ref={register({ required: true })}
            name="name"
          />
          {errors.name && <p className="text-red-500">Name is required</p>}
        </div>
        <div className="mt-4">
          <input
            type="text"
            className="border-gray-400 border-2 rounded-md w-full h-10 p-2"
            placeholder="Description"
            ref={register({ required: true })}
            name="description"
          />
          {errors.description && (
            <p className="text-red-500">Description is required</p>
          )}
        </div>
        <div className="mt-4">
          <input
            type="text"
            className="border-gray-400 border-2 rounded-md w-full h-10 p-2"
            placeholder="Price"
            ref={register({ required: true })}
            name="price"
          />
          {errors.price && <p className="text-red-500">Price is required</p>}
        </div>
        <div className="mt-4">
          <button
            className="w-40 p-2 text-sm bg-blue-500 rounded-md text-white"
            type="submit"
          >
            Create Artwork
          </button>
        </div>
      </form>
    </div>
  );
}

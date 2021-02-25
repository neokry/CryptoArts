import { gql, useQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ArtworkData from "../../models/ArtworkData";

const SINGLE_ARTWORK = gql`
  query GetArtworks($userId: Bytes!, $artworkName: String!) {
    artworks(where: { artist: $userId, name: $artworkName }) {
      id
      artist
      owner
      currentPrice
      image
      name
      description
    }
  }
`;

export default function UserArtwork() {
  const router = useRouter();
  const context = useWeb3React();

  const { account } = context;
  const { userId, artworkId } = router.query;

  const [artworkName, setArtworkName] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (artworkId) {
      const str = artworkId as string;
      setArtworkName(str.replaceAll("-", " "));
    }
  }, [artworkId]);

  useEffect(() => {
    if (account && account.localeCompare(userId as string)) setIsOwner(true);
  }, [account, userId]);

  const { loading, error, data } = useQuery(SINGLE_ARTWORK, {
    skip: !artworkName,
    variables: { userId, artworkName },
  });

  if (loading || !data) return <div></div>;

  const artwork: ArtworkData = data.artworks[0];
  const { image, name, artist, currentPrice, description } = artwork;

  return (
    <div>
      <div className="w-full flex items-center justify-center">
        <img
          src={`https://ipfs.io/ipfs/${image}`}
          alt="artwork image"
          className="h-64 object-scale-down"
        />
      </div>
      <p className="font-bold text-5xl mt-10">{name}</p>
      <div className="flex mt-8 ">
        <div className="w-1/2">
          <p className="font-bold">Description</p>
          <p className="text-gray-600 text-xl">{description}</p>
          <p className="mt-8 font-bold">Artist</p>
          <Link href={"/" + artist}>
            <p className="text-gray-600 text-xl cursor-pointer">{artist}</p>
          </Link>
        </div>
        <div className="w-1/2">
          <BuyWidget currentPrice={currentPrice} isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
}

function BuyWidget({ currentPrice, isOwner }) {
  return (
    <div className="w-full shadow-lg rounded-xl p-4 border">
      <div className="flex items-baseline">
        <p className="font-bold mr-2">Current Price:</p>
        <p className="text-2xl font-bold text-blue-400">${currentPrice}</p>
      </div>

      {isOwner ? (
        <div className="w-full mt-4">
          <div className="flex items-center justify-center p-4 w-full bg-red-400 text-white rounded-lg">
            <p className="font-bold text-4xl">Unlist This Artwork</p>
          </div>
        </div>
      ) : (
        <button className="w-full mt-4">
          <div className="flex items-center justify-center p-4 w-full bg-blue-400 text-white rounded-lg">
            <p className="font-bold text-4xl">Buy Now</p>
          </div>
        </button>
      )}
    </div>
  );
}

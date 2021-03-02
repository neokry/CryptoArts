import { gql, useQuery } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useArtworkFactory } from "../../hooks/useArtworkFactory";
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
      soldPriceHistory
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
    if (account && account.toLowerCase().localeCompare(userId as string) == 0)
      setIsOwner(true);
  }, [account, userId]);

  const { loading, error, data } = useQuery(SINGLE_ARTWORK, {
    skip: !artworkName,
    variables: { userId, artworkName },
  });

  if (loading || !data) return <div></div>;

  const artwork: ArtworkData = data.artworks[0];
  const {
    image,
    name,
    artist,
    currentPrice,
    description,
    id,
    owner,
    soldPriceHistory,
  } = artwork;
  const priceInEth = ethers.utils.formatEther(currentPrice);

  console.log("price", currentPrice == 0);

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
          <p className="mt-8 font-bold">Owner</p>
          <Link href={"/" + owner}>
            <p className="text-gray-600 text-xl cursor-pointer">{owner}</p>
          </Link>
        </div>
        <div className="w-1/2">
          {currentPrice == 0 ? (
            <ListWidget
              artworkId={id}
              isOwner={isOwner}
              soldPriceHistory={soldPriceHistory}
            />
          ) : (
            <BuyWidget
              currentPrice={priceInEth.toString()}
              isOwner={isOwner}
              artworkId={id}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ListWidget({ artworkId, isOwner, soldPriceHistory }) {
  const [listPrice, setListPrice] = useState("");
  const { setArtworkPrice } = useArtworkFactory();
  const lastSold = ethers.utils.formatEther(
    soldPriceHistory[soldPriceHistory.length - 1]
  );

  return (
    <div className="w-full shadow-lg rounded-xl p-4 border">
      {isOwner ? (
        <>
          <div className="flex items-baseline">
            <p className="font-bold mr-2">List For:</p>
            <span className="text-gray-600">$</span>
            <input
              className="focus:outline-none text-gray-600"
              placeholder="100"
              type="text"
              value={listPrice}
              onChange={(e) => setListPrice(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="w-full mt-4"
            onClick={() => setArtworkPrice(artworkId, +listPrice)}
          >
            <div className="flex items-center justify-center p-4 w-full bg-blue-400 text-white rounded-lg">
              <p className="font-bold text-4xl">List Artwork</p>
            </div>
          </button>
        </>
      ) : (
        <>
          <div className="flex items-baseline">
            <p className="font-bold mr-2">Last Sold For:</p>
            <span className="text-gray-600">${lastSold}</span>
          </div>
          <div className="w-full mt-4">
            <div className="flex items-center justify-center p-4 w-full bg-gray-400 text-white rounded-lg">
              <p className="font-bold text-4xl">Not For Sale</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function BuyWidget({ currentPrice, isOwner, artworkId }) {
  const { setArtworkPrice, buyArtwork } = useArtworkFactory();

  return (
    <div className="w-full shadow-lg rounded-xl p-4 border">
      <div className="flex items-baseline">
        <p className="font-bold mr-2">Current Price:</p>
        <p className="text-2xl font-bold text-blue-400">${currentPrice}</p>
      </div>

      {isOwner ? (
        <button
          type="button"
          className="w-full mt-4"
          onClick={async () => await setArtworkPrice(artworkId, 0)}
        >
          <div className="flex items-center justify-center p-4 w-full bg-red-400 text-white rounded-lg">
            <p className="font-bold text-4xl">Unlist This Artwork</p>
          </div>
        </button>
      ) : (
        <button
          className="w-full mt-4"
          type="button"
          onClick={async () => await buyArtwork(artworkId, currentPrice)}
        >
          <div className="flex items-center justify-center p-4 w-full bg-blue-400 text-white rounded-lg">
            <p className="font-bold text-4xl">Buy Now</p>
          </div>
        </button>
      )}
    </div>
  );
}

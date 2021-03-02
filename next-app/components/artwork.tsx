import { ethers } from "ethers";
import Link from "next/link";
import ArtworkData from "../models/ArtworkData";

export const Artwork: React.FC<ArtworkData> = ({
  image,
  currentPrice,
  name,
  artist,
  soldPriceHistory,
}) => {
  let lastSold;
  if (soldPriceHistory) {
    lastSold = ethers.utils.formatEther(
      soldPriceHistory[soldPriceHistory.length - 1]
    );
  }

  return (
    <Link href={"/" + artist + "/" + name.replaceAll(" ", "-")}>
      <div className="border rounded-lg w-64 h-96 m-4 flex flex-col items-center justify-top shadow-md cursor-pointer">
        <img
          src={`https://ipfs.io/ipfs/${image}`}
          alt="artwork image"
          className="w-full object-scale-down h-72"
        />
        <div className="mt-6 font-bold text-xl text-gray-600">{name}</div>
        <div className="text-gray-400">
          {currentPrice > 0
            ? `Price: $${ethers.utils.formatEther(currentPrice)}`
            : `Sold: $${lastSold}`}
        </div>
      </div>
    </Link>
  );
};

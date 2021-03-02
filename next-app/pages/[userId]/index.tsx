import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Artwork } from "../../components/artwork";
import { ArtworkFeed } from "../../components/artwork-feed";
import { Title } from "../../components/title";

const USER_ARTWORKS = gql`
  query GetArtworks($userId: Bytes!) {
    artworks(where: { artist: $userId }) {
      id
      artist
      owner
      currentPrice
      image
      name
      soldPriceHistory
    }
  }
`;

const USER_COLLECTION = gql`
  query GetCollection($userId: Bytes!) {
    artworks(where: { owner: $userId }) {
      id
      artist
      owner
      currentPrice
      image
      name
      soldPriceHistory
    }
  }
`;

export default function UserProfile() {
  const router = useRouter();
  const context = useWeb3React();

  const { userId } = router.query;
  const { account } = context;

  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    if (account == userId) setIsUser(true);
  }, [account, userId]);

  const getArtworks = useQuery(USER_ARTWORKS, {
    variables: { userId },
  });

  const getCollection = useQuery(USER_COLLECTION, {
    variables: { userId },
  });

  console.log("art", getArtworks.data);

  return (
    <div>
      <div className="flex justify-between border-b pb-10">
        <p>{userId}</p>
        {isUser && (
          <Link href="/profile">
            <button>Edit Profile</button>
          </Link>
        )}
      </div>
      <div className="mt-6">
        {getArtworks.data && getArtworks.data.artworks.length > 0 && (
          <>
            <div className="ml-4">
              <Title title="My Artworks" />
            </div>

            <ArtworkFeed artworks={getArtworks.data.artworks} />
          </>
        )}
      </div>

      <div className="mt-6">
        {getCollection.data && getCollection.data.artworks.length > 0 && (
          <>
            <div className="ml-4">
              <Title title="My Collection" />
            </div>

            <ArtworkFeed artworks={getCollection.data.artworks} />
          </>
        )}
      </div>
    </div>
  );
}

import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Artwork } from "../../components/artwork";
import { ArtworkFeed } from "../../components/artwork-feed";

const USER_ARTWORKS = gql`
  query GetArtworks($userId: Bytes!) {
    artworks(artist: $userId) {
      id
      artist
      owner
      currentPrice
      image
      name
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

  const { loading, error, data } = useQuery(USER_ARTWORKS, {
    variables: { userId },
  });

  let artworks;

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
        {data && <ArtworkFeed artworks={data.artworks} />}
      </div>
    </div>
  );
}

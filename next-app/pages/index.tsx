import { gql, useQuery } from "@apollo/client";
import { Artwork } from "../components/artwork";
import { ArtworkFeed } from "../components/artwork-feed";

const EXPLORE_QUERY = gql`
  query GetArtworks {
    artworks {
      id
      artist
      owner
      currentPrice
      image
      name
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(EXPLORE_QUERY);
  if (loading) return <div></div>;
  if (error) return <div>Error: {error}</div>;

  console.log("data", data);

  return <ArtworkFeed artworks={data.artworks} />;
}

import ArtworkData from "../models/ArtworkData";
import { Artwork } from "./artwork";

interface ArtworkFeedProps {
  artworks: ArtworkData[];
}

export const ArtworkFeed: React.FC<ArtworkFeedProps> = ({ artworks }) => {
  return (
    <div className="flex">
      {artworks.map((artwork) => (
        <div key={artwork.id}>
          <Artwork {...artwork} />
        </div>
      ))}
    </div>
  );
};

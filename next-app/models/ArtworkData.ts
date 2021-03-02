export default interface ArtworkData {
  id: string;
  image: string;
  name: string;
  artist: string;
  owner: string;
  currentPrice: number;
  description: string;
  soldPriceHistory: number[];
}

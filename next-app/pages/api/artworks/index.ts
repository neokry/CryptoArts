import { NextApiRequest, NextApiResponse } from "next";
import ArtworkService from "../../../packages/api/services/ArtworkService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { getArtworks } = ArtworkService();

  if (req.method == "GET") {
    const artworks = await getArtworks();
    res.status(200).json(artworks);
  } else {
    res.status(405).end("Method Not Allowed");
  }
};

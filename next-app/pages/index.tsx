import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import NewArtwork from "../components/new-artwork";
import { useArtworkFactory } from "../hooks/useArtworkFactory";
import { useEagerConnect } from "../hooks/useEgarConnection";

export default function Home() {
  const context = useWeb3React();
  const triedEager = useEagerConnect();
  const artwork = useArtworkFactory();

  if (triedEager) {
    return <NewArtwork />;
  } else {
    return <div>Loading</div>;
  }
}

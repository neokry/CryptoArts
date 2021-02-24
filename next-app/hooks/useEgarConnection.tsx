import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { injected } from "../connectors/injected";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  const init = async () => {
    console.log("Loading connection...");
    await activate(
      injected,
      (err) => {
        console.log("Error loading connection", err);
      },
      true
    );
    setTried(true);
  };

  useEffect(() => {
    init();
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

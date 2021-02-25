import "../styles/globals.css";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Layout from "../components/layout";

function getLibrary(provider, connector) {
  return new Web3Provider(provider);
}

function getApollo() {
  return new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/patrickgenevich/crypto-arts",
    cache: new InMemoryCache(),
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={getApollo()}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Web3ReactProvider>
    </ApolloProvider>
  );
}

export default MyApp;

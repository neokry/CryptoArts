import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useEagerConnect } from "../hooks/useEgarConnection";

export default function Header() {
  const triedEager = useEagerConnect();
  const context = useWeb3React();
  const { account } = context;

  return (
    <div className="p-4 px-12 w-full flex justify-between items-baseline border-b">
      <Link href="/">
        <a className="text-2xl font-thin">Crypto Arts</a>
      </Link>
      <div>
        {!account && (
          <button className="border-2 border-blue-500 text-blue-500 p-2 px-4 rounded-full font-bold">
            Sign In
          </button>
        )}
        {account && (
          <>
            <Link href="/create">
              <a className="mr-6 text-gray-500">Create</a>
            </Link>
            <Link href={"/" + account}>
              <button className="border-2 border-blue-500 text-blue-500 p-2 px-4 rounded-full font-bold focus:outline-none">
                My Profile
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

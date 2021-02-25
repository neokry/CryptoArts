import Header from "./header";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl p-4 mx-auto mt-8">
        {children}
      </main>
    </div>
  );
}

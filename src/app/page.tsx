import { SearchBar } from "@/components/search/bar";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <SearchBar></SearchBar>
      </Suspense>
    </>
  );
}

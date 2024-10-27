import { SearchBar } from "@/components/search/bar";
import { SearchBarSkeleton } from "@/components/skeletons/skeletons";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<SearchBarSkeleton></SearchBarSkeleton>}>
        <SearchBar></SearchBar>
      </Suspense>
    </>
  );
}

import { SearchBar } from "../search/bar";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export function SearchBarSkeleton() {
  return (
    <>
      <div className="w-full md:w-[600px] px-10 md:p-0 flex flex-col gap-5">
        <div className="  gap-3 flex bg-gradient-to-r from-gray-700 to-gray-900 p-5 rounded-2xl">
          <Input value={"Loading.."} disabled></Input>
          <Input
            autoCapitalize="off"
            placeholder="Enter Token Symbol"
            className="flex-[4] placeholder:text-black/40  bg-gray-500 outline-none border-none"
          ></Input>
        </div>
        <div className="max-h-[300px] md:max-h-[400px]"></div>
      </div>
    </>
  );
}

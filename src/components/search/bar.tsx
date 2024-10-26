"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { CryptoItem, CryptoItemSkeleton } from "./crypto-item";
import { ScrollArea } from "../ui/scroll-area";

interface SearchDataProps {
  query: string;
  amount: number;
}

export function SearchData({ query, amount }: SearchDataProps) {
  const [data] = useQueries({
    queries: [
      {
        queryKey: ["token", query],
        queryFn: async (): Promise<
          {
            symbol: string;
            price: number;
            icon: string | undefined;
            id: number;
            name: string | undefined;
          }[]
        > => {
          const json = await (await fetch("/api/token/" + query)).json();

          return json;
        },
        enabled: !!query,
        refetchInterval: 60 * 1000,
      },
    ],
  });

  return (
    <ScrollArea className="h-[300px] md:h-[500px]">
      <div className="flex flex-col  gap-3">
        {data?.data?.map((item) => {
          const fiatAmount = item.price * amount;
          const fiatAmountString = fiatAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const priceAmountString = item.price?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return (
            <CryptoItem
              key={item.id}
              symbol={item.symbol}
              amount={amount.toString()}
              price={priceAmountString}
              icon={item.icon}
              fiatAmount={fiatAmountString}
              name={item.name}
            />
          );
        })}
        {!data?.data && query && <CryptoItemSkeleton></CryptoItemSkeleton>}
      </div>
    </ScrollArea>
  );
}

export function SearchBar() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string>("");
  const [amount, setAmount] = useState<string>("1");

  const onSearch = useDebouncedCallback((newString: string) => {
    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set("query", newString);
    urlSearchParams.set("amount", amount);
    router.replace(`${pathName}?${urlSearchParams.toString()}`);
  }, 150);
  const onSearchAmount = useDebouncedCallback((newString: string) => {
    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set("query", value);
    urlSearchParams.set("amount", newString);
    router.replace(`${pathName}?${urlSearchParams.toString()}`);
  }, 150);

  useEffect(() => {
    const query = searchParams.get("query");
    const amount = searchParams.get("amount");

    if (query) {
      setValue(query);
    }
    if (amount) {
      setAmount(amount);
    }
  }, []);

  return (
    <div className="w-full md:w-[600px] px-10 md:p-0 flex flex-col gap-5">
      <div className="  gap-3 flex bg-gradient-to-r from-gray-700 to-gray-900 p-5 rounded-2xl">
        <Input
          placeholder="Enter Token Symbol"
          onChange={(event) => {
            setValue(event.target.value);

            onSearch(event.target.value);
          }}
          value={value}
          className="flex-[4] placeholder:text-black/40  bg-gray-500 outline-none border-none"
        ></Input>
        <Input
          placeholder="Enter Token Amount"
          type="number"
          value={amount}
          onChange={(event) => {
            const num = Number(event.target.value);
            if (num < 0) return;
            else if (
              event.target.value.startsWith("0") &&
              event.target.value.length !== 1
            ) {
              const newString = event.target.value.replace("0", "");
              setAmount(newString);
              onSearchAmount(newString);
            } else {
              setAmount(event.target.value);
              onSearchAmount(event.target.value);
            }
          }}
          className=" flex-1  placeholder:text-black/40  bg-gray-500 outline-none border-none"
        ></Input>
      </div>
      <SearchData query={value} amount={Number(amount)}></SearchData>
    </div>
  );
}

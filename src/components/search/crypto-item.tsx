"use client";

import Image from "next/image";
import { Card, CardHeader } from "../ui/card";
import Link from "next/link";

interface Props {
  icon?: string;
  symbol: string;
  price: string;
  amount: string;
  fiatAmount: string;
  name?: string;
}

export function CryptoItem({ icon, price, fiatAmount, name }: Props) {
  const priceInfo = price ? price : "There is no price information!";

  const link =
    "https://coinmarketcap.com/currencies/" +
    name?.replaceAll(" ", "-").toLowerCase();

  return (
    <div className="animate-item-appers origin-left">
      <Card
        className="animate-background-pan border-none bg-gradient-to-r
    from-blue-800 to-green-800 dark:from-blue-900 dark:to-green-950 bg-[length:200%_200%]"
      >
        <CardHeader className="">
          <div className="flex items-center gap-5">
            <div className="relative w-10 h-10">
              <Link href={link} target="_blank">
                <Image
                  className="rounded-xl"
                  fill
                  src={icon ? icon : ""}
                  alt={name ? name : ""}
                />
              </Link>
            </div>
            <p>
              {"Price: "}
              <span className="text-yellow-300">{priceInfo}</span>
            </p>
            {price && (
              <p>
                {"Value: "}
                <span className="text-yellow-300">{fiatAmount}</span>
              </p>
            )}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

import {
  coinMarketCapApiEndpoint,
  coinMarketCapPriceApi,
  coinMarketCapInfoApi,
} from "@/lib/crypto";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const query = (await params).symbol;

  const [tokenData, price] = await Promise.all([
    (async () => {
      const data = await (
        await fetch(
          coinMarketCapApiEndpoint + coinMarketCapInfoApi + "?symbol=" + query,
          {
            method: "GET",
            headers: {
              "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY
                ? process.env.CMC_API_KEY
                : "",
            },
          }
        )
      ).json();

      const dataArray: {
        logo: string;
        symbol: string;
        id: number;
        slug: string;
      }[] = data?.data?.[query.toUpperCase()];

      return dataArray?.map((item) => {
        return {
          logo: item.logo,
          symbol: item.symbol,
          id: item.id,
          name: item.slug,
        };
      });
    })(),
    (async () => {
      const data = await fetch(
        coinMarketCapApiEndpoint +
          coinMarketCapPriceApi +
          "?amount=1&symbol=" +
          query,
        {
          headers: {
            "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY
              ? process.env.CMC_API_KEY
              : "",
          },
        }
      );

      const json = await data.json();

      const dataArray: {
        symbol: string;
        quote: { USD: { price: number } };
        id: number;
      }[] = json.data;

      return dataArray?.map((item) => {
        return {
          symbol: item.symbol,
          price: item.quote.USD.price,
          id: item.id,
        };
      });
    })(),
  ]);

  const infoMap = new Map<number, { logo: string; name: string }>();
  tokenData?.forEach((item) => {
    infoMap.set(item.id, {
      logo: item.logo,
      name: item.name,
    });
  });

  const dataArray = price?.map((item) => {
    return {
      symbol: item.symbol,
      price: item.price,
      icon: infoMap.get(item.id)?.logo,
      id: item.id,
      name: infoMap.get(item.id)?.name,
    };
  });

  return Response.json(dataArray ? dataArray : []);
}

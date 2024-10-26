import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookie = await cookies();

  cookie.set("dark-mode", body.darkMode.toString(), {
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json(body);
}

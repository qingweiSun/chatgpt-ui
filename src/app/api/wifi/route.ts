import { NextRequest, NextResponse } from "next/server";

async function makeRequest(req: NextRequest) {
  try {
    const content = req.nextUrl.searchParams.get("query");
    const query = encodeURIComponent(content!);
    const api = await fetch(
      `${"http://api.qingwei.icu"}/search?q=${query}&max_results=3`
    );
    const res = new NextResponse(api.body);
    res.headers.set("Content-Type", "application/json");
    res.headers.set("Cache-Control", "no-cache");
    return res;
  } catch (e) {
    console.error("[OpenAI] ", req.body, e);
    return NextResponse.json(
      {
        error: true,
        msg: JSON.stringify(e),
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  return makeRequest(req);
}
export const runtime = "edge";

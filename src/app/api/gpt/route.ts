import fetch from "node-fetch";

export async function POST(request: Request) {
    try {
        return fetch("https://qingwei.icu/api/generate", {
            method: "POST",
            // @ts-ignore
            body: request.body,
            duplex: true,
        });
    } catch (e) {
        return new Response(JSON.stringify(e))
    }
}

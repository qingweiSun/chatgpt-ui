export async function POST(request: Request) {

    const res = await fetch("https://www.qingwei.icu/api/generate", {
        method: "POST",
        body: request.body,
    })
    return new Response(res.body);
}

export async function POST(request: Request) {
  return fetch("https://www.qingwei.icu/api/generate", {
    method: "POST",
    body: request.body,
  });
}

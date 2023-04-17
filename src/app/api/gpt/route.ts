export async function POST(request: Request) {
  return fetch("https://qingwei.icu/api/generate", {
    method: "POST",
    body: request.body,
  });
}

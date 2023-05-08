import fetch from "node-fetch";

export async function POST(request: Request) {
  const body = await request.json();
  const messages = body.messages;
  const apiKey =
    body.apiKey || "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";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      stream: false,
    }),
  });
  return res;
}

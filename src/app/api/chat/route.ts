import { createParser } from "eventsource-parser";
import fetch from "node-fetch";
//部署在 vercel 上的时候，免费版有 10s 限制，所以我才不用的，只使用了前端
async function createStream(req: Request) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const body = await req.json();
  const messages = body.messages;
  const model = body.model || "gpt-3.5-turbo";
  const apiKey = body.apiKey || process.env.API_KEY;
  if (apiKey == null || apiKey == "") {
    return "API Key is empty. 请参阅Readme";
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: model,
      messages,
      stream: true,
    }),
  });

  return new ReadableStream({
    async start(controller) {
      function onParse(event: any) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk, { stream: true }));
      }
    },
  });
}

export async function POST(req: Request) {
  try {
    const stream = await createStream(req);
    return new Response(stream);
  } catch (error) {
    return new Response(
      ["```json\n", JSON.stringify(error, null, "  "), "\n```"].join("")
    );
  }
}

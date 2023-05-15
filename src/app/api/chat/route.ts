import { createParser } from "eventsource-parser";
import fetch from "node-fetch";
// https://check.openai-365.com/get_usage?api_key=sk-SYSTpAd1N9GUK62pUzs2B36lbk1J2vauFGvYRGpH6wkUscSV 余额查询
async function createStream(req: Request) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const body = await req.json();
  const messages = body.messages;
  const apiKey =
    body.apiKey || "sk-SYSTpAd1N9GUK62pUzs2B36lbk1J2vauFGvYRGpH6wkUscSV";
  const res = await fetch("https://api.openai-365.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      //   stream: true,
    }),
  });
  if (res.ok) {
    const temp: any = await res.json();
    console.log(temp);
    return new Response(temp.choices[0].message.content);
  } else {
    return new Response(
      ["```json\n", JSON.stringify(res.statusText, null, "  "), "\n```"].join(
        ""
      )
    );
  }
}
//   console.log(await res.json());
//   return new ReadableStream({
//     async start(controller) {
//       function onParse(event: any) {
//         if (event.type === "event") {
//           const data = event.data;
//           if (data === "[DONE]") {
//             controller.close();
//             return;
//           }
//           try {
//             const json = JSON.parse(data);
//             const text = json.choices[0].delta.content;
//             const queue = encoder.encode(text);
//             controller.enqueue(queue);
//           } catch (e) {
//             controller.error(e);
//           }
//         }
//       }

//       const parser = createParser(onParse);
//       for await (const chunk of res.body as any) {
//         parser.feed(decoder.decode(chunk, { stream: true }));
//       }
//     },
//   });
//}

export async function POST(req: Request) {
  try {
    return await createStream(req);
    // return new Response(stream);
  } catch (error) {
    console.error("[Chat Stream]", error);
    return new Response(
      ["```json\n", JSON.stringify(error, null, "  "), "\n```"].join("")
    );
  }
}

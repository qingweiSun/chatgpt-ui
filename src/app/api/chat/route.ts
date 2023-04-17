import {createParser} from "eventsource-parser";
import fetch from "node-fetch";

async function createStream(req: Request) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const body = await req.json();
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
                parser.feed(decoder.decode(chunk, {stream: true}));
            }
        },
    });
}

export async function POST(req: Request) {
    try {
        const stream = await createStream(req);
        return new Response(stream);
    } catch (error) {
        console.error("[Chat Stream]", error);
        return new Response(
            ["```json\n", JSON.stringify(error, null, "  "), "\n```"].join("")
        );
    }
}

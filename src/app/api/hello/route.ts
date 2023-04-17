import {createParser} from "eventsource-parser/src";

export async function POST(request: Request) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const response = await fetch("https://www.qingwei.icu/api/generate", {
        method: "POST",
        body: request.body,
    })

    // if (response.ok) {
    //     const data = response.body;
    //     if (data) {
    //         const reader = data.getReader();
    //         const decoder = new TextDecoder("utf-8");
    //         let done = false;
    //         let currentAssistantMessage = "";
    //         while (!done) {
    //             const {value, done: readerDone} = await reader.read();
    //             if (value) {
    //
    //             }
    //             done = readerDone;
    //         }
    //     } else {
    //
    //
    //     }
    // } else {
    //
    // }
    return new ReadableStream({
        async start(controller) {
            function onParse(event: any) {
                if (event.type === "event") {
                    const data = event.data;
                    try {
                        if (data) {
                            controller.enqueue(data);
                        } else {
                            controller.close();
                        }
                    } catch (e) {
                        controller.error(e);
                    }
                }
            }

            const parser = createParser(onParse);
            for await (const chunk of response.body as any) {
                parser.feed(chunk);
            }
            controller.close();
        },
    });
}

"use server";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function sendChat(
  messages: Message[],
): Promise<ReadableStream<string>> {
  const openaiResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        stream: true,
      }),
    },
  );

  if (!openaiResponse.ok || !openaiResponse.body) {
    throw new Error(
      `OpenAI request failed: ${openaiResponse.status} ${openaiResponse.statusText}`,
    );
  }

  const body = openaiResponse.body;

  return new ReadableStream({
    async start(controller) {
      const reader = body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.replace("data:", "").trim();
          if (data === "[DONE]") continue;

          const token = JSON.parse(data).choices[0].delta.content;
          if (token) controller.enqueue(token);
        }
      }
      controller.close();
    },
  });
}

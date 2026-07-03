"use server";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function sendChat(messages: Message[]): Promise<Message> {
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
      }),
    },
  );

  const data = await openaiResponse.json();
  return data.choices[0].message;
}

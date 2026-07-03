This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

#### Custom ChatGPT - Chat function and basic UI

Build a single working chat that holds a conversation.

- Set up a new Next.js project.
- Add your API key to `.env.local` as `OPENAI_API_KEY`.
- Create a server function that takes a `messages` array, calls the OpenAI API with `fetch`, and returns `choices[0].message`.
- Build a client component with state for the message list and the input field.
- On submit, append the new user message, pass the whole `messages` array to your server function, and append the returned assistant message to the list.
- Render the conversation by mapping over the messages, showing the `role` and `content` of each.

#### Custom ChatGPT - Multiple chats with a sidebar

Let the user keep several conversations and switch between them.

- Model the app state as a list of chats, where each chat has an `id`, a `title`, and its own `messages` array.
- Add a sidebar that lists every chat and a button to start a new, empty one.
- Clicking a chat in the sidebar makes it the active chat and shows its messages in the window.
- Derive each chat’s title from its first user message so the sidebar is readable.
- Persist the full list of chats in `localStorage` and load it on startup, so chats survive a page refresh. You can use the package `useLocalStorageState` for this.

#### Custom ChatGPT - Stream the replies

Replace the wait-for-everything reply with a live, word-by-word one.

- Add `stream: true` to the request body in your streaming server function.
- In that function, read OpenAI’s SSE stream, pull `delta.content` out of each `data:` line, skip the `[DONE]` marker, and return the tokens as a `ReadableStream`.
- On the client, add an empty assistant message before reading the stream, then read the returned stream chunk by chunk.
- Append each chunk to the running reply and update state on every chunk so the text grows on screen.
- Make sure the finished assistant message ends up saved in the active chat, so it persists like the rest.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

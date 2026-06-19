import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Code Snippet Library
      </h1>
      <p className="max-w-md text-muted-foreground">
        Explore a collection of useful code snippets for various programming
        languages and frameworks.
      </p>
      <Button render={<Link href="/snippets" />}>Browse Snippets</Button>
    </main>
  );
}

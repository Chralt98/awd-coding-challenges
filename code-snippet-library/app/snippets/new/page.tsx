import { createNewSnippet } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

export default function NewSnippetPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Button variant="ghost" className="mb-6" render={<Link href="/snippets" />}>
        &larr; Back to all snippets
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New Snippet</CardTitle>
          <CardDescription>Add a new code snippet to the library.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createNewSnippet} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Language</Label>
              <Input id="language" name="language" placeholder="Language" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Description" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" name="code" placeholder="Code" />
            </div>
            <Button type="submit" className="mt-2">Create Snippet</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

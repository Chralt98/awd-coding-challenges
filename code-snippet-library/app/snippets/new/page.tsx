import { createNewSnippet } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewSnippetPage() {
  return (
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
      <Button type="submit">Create request</Button>
    </form>
  );
}

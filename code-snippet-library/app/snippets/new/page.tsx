"use client";

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
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormValues = {
  title: string;
  language: string;
  description: string;
  code: string;
};

export default function NewSnippetPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("language", data.language);
    formData.append("description", data.description);
    formData.append("code", data.code);

    await createNewSnippet(formData);
    router.push("/snippets");
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Button
        variant="ghost"
        className="mb-6"
        nativeButton={false}
        render={<Link href="/snippets" />}
      >
        &larr; Back to all snippets
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New Snippet</CardTitle>
          <CardDescription>
            Add a new code snippet to the library.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Title must be at most 100 characters",
                  },
                })}
                placeholder="Title"
              />
              {errors.title && <p>{errors.title.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Language</Label>
              <Input
                {...register("language", {
                  required: "Language is required",
                  minLength: {
                    value: 1,
                    message: "Language must be at least 1 character",
                  },
                  maxLength: {
                    value: 30,
                    message: "Language must be at most 30 characters",
                  },
                })}
                placeholder="Language"
              />
              {errors.language && <p>{errors.language.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                  maxLength: {
                    value: 500,
                    message: "Description must be at most 500 characters",
                  },
                })}
                placeholder="Description"
              />
              {errors.description && <p>{errors.description.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Code</Label>
              <Input
                {...register("code", {
                  required: "Code is required",
                  minLength: {
                    value: 3,
                    message: "Code must be at least 3 characters",
                  },
                  maxLength: {
                    value: 10000,
                    message: "Code must be at most 10000 characters",
                  },
                })}
                placeholder="Code"
              />
              {errors.code && <p>{errors.code.message}</p>}
            </div>
            <Button type="submit" nativeButton={true} className="mt-2">
              Create Snippet
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import {
  loadPosts,
  addViewMetadata,
  Post,
  addPost,
  findPostBySlug,
  updatePost as savePostChanges,
  deletePost as removePost,
} from "../models/postModel.js";

const allowedContentTags = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "blockquote",
  "br",
  "img",
];

const allowedContentAttributes = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title"],
};

function sanitizePostContent(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: allowedContentTags,
    allowedAttributes: allowedContentAttributes,
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });
}

export async function showAdmin(_req: Request, res: Response) {
  const posts = await loadPosts();
  const view = addViewMetadata(posts);

  res.render("admin.html", {
    posts: view,
  });
}

export function showNewPostForm(_req: Request, res: Response) {
  res.render("postForm.html", {
    formTitle: "Add Post",
    formAction: "/admin/posts",
    submitLabel: "Send",
  });
}

export async function createNewPost(req: Request, res: Response) {
  const { title, image, author, teaser, content } = req.body;

  if (!title || !image || !author || !teaser || !content) {
    res.status(400).send("All fields are required.");
    return;
  }

  const newPost = {
    title,
    image,
    author,
    teaser,
    content: sanitizePostContent(content),
    createdAt: Math.floor(Date.now() / 1000),
  } as Post;

  await addPost(newPost);

  res.redirect("/admin");
}

export async function showEditPostForm(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const post = await findPostBySlug(req.params.slug);

  if (!post) {
    res.status(404).send("Post not found");
    return;
  }

  res.render("postForm.html", {
    formTitle: "Edit Post",
    formAction: `/admin/posts/${req.params.slug}`,
    submitLabel: "Save",
    post,
  });
}

export async function updatePost(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { title, image, author, teaser, content } = req.body;

  if (!title || !image || !author || !teaser || !content) {
    res.status(400).send("All fields are required.");
    return;
  }

  await savePostChanges(req.params.slug, {
    title,
    image,
    author,
    teaser,
    content: sanitizePostContent(content),
  });

  res.redirect("/admin");
}

export async function deletePost(
  req: Request<{ slug: string }>,
  res: Response,
) {
  await removePost(req.params.slug);

  res.redirect("/admin");
}

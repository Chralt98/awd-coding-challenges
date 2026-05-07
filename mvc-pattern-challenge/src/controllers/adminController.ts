import { Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import {
  loadPosts,
  addViewMetadata,
  Post,
  findPostById,
  updateBlogEntry,
  deleteBlogEntry,
  createBlogEntry,
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

  await createBlogEntry(newPost);

  res.redirect("/admin");
}

export async function showEditPostForm(
  req: Request<{ id: number }>,
  res: Response,
) {
  const post = await findPostById(req.params.id);

  if (!post) {
    res.status(404).send("Post not found");
    return;
  }

  res.render("postForm.html", {
    formTitle: "Edit Post",
    formAction: `/admin/posts/${req.params.id}`,
    submitLabel: "Save",
    post,
  });
}

export async function updatePost(req: Request<{ id: number }>, res: Response) {
  const { title, image, author, teaser, content, createdAt } = req.body;

  if (!title || !image || !author || !teaser || !content || !createdAt) {
    res.status(400).send("All fields are required.");
    return;
  }

  try {
    await updateBlogEntry(req.params.id, {
      title,
      image,
      author,
      teaser,
      content: sanitizePostContent(content),
      createdAt,
    });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).send("Error updating post");
    return;
  }

  res.redirect("/admin");
}

export async function deletePost(req: Request<{ id: number }>, res: Response) {
  try {
    await deleteBlogEntry(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).send("Error deleting post");
  }
}

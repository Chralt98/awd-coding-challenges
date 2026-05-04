import { type Request, type Response } from "express";
import { PAGE_SIZE } from "../app.js";
import { formatDate, slugify, loadPosts } from "../models/postModel.js";

export function showHome(req: Request, res: Response) {
  const posts = loadPosts();

  const authorFilter =
    typeof req.query.author === "string" ? req.query.author.trim() : "";
  const sort = req.query.sort === "oldest" ? "oldest" : "newest";
  const page =
    typeof req.query.page === "string" &&
    Number.isInteger(Number(req.query.page))
      ? Math.max(1, Number(req.query.page))
      : 1;

  const filteredPosts = authorFilter
    ? posts.filter((post) =>
        post.author.toLowerCase().includes(authorFilter.toLowerCase()),
      )
    : posts;

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sort === "oldest") {
      return a.createdAt - b.createdAt;
    }
    return b.createdAt - a.createdAt;
  });

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedPosts = sortedPosts.slice(start, start + PAGE_SIZE);

  const view = pagedPosts.map((post) => ({
    ...post,
    slug: slugify(post.title),
    createdAt: formatDate(post.createdAt),
  }));

  res.render("index.html", {
    posts: view,
    controls: {
      author: authorFilter,
      sort,
      page: currentPage,
      totalPages,
      hasPrev: currentPage > 1,
      hasNext: currentPage < totalPages,
    },
  });
}

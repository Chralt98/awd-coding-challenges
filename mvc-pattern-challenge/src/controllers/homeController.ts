import { type Request, type Response } from "express";
import {
  loadPosts,
  filterPostsByAuthor,
  sortPostsByDate,
  addViewMetadata,
  type Post,
} from "../models/postModel.js";

export const PAGE_SIZE = 2;

export async function showHome(req: Request, res: Response) {
  var posts: Post[] = [];
  try {
    posts = await loadPosts();
  } catch (error) {
    console.error("Error loading posts:", error);
    return res.status(500).send("Error loading posts");
  }

  const authorFilter =
    typeof req.query.author === "string" ? req.query.author.trim() : "";
  const sort = req.query.sort === "oldest" ? "oldest" : "newest";
  const page =
    typeof req.query.page === "string" &&
    Number.isInteger(Number(req.query.page))
      ? Math.max(1, Number(req.query.page))
      : 1;

  const filteredPosts = authorFilter
    ? filterPostsByAuthor(posts, authorFilter)
    : posts;

  const sortedPosts = sortPostsByDate(filteredPosts, sort);

  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedPosts = sortedPosts.slice(start, start + PAGE_SIZE);

  const view = addViewMetadata(pagedPosts);

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

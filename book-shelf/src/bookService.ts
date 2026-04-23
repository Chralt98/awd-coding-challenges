import type {
  EntityId,
  Book,
  IsbnParts,
  BookCreatePayload,
  BookUpdatePayload,
  BookPreview,
  ApiResponse,
} from "../types/book.js";

// Write the following function signatures (stub implementations are fine):

interface IBookOps {
  fetchBooks(): Promise<ApiResponse<BookPreview[]>>;
  fetchBook(id: EntityId): Promise<ApiResponse<Book>>;
  createBook(payload: BookCreatePayload): Promise<ApiResponse<Book>>;
  updateBook(
    id: EntityId,
    changes: BookUpdatePayload,
  ): Promise<ApiResponse<Book>>;
  parseIsbn(isbn: string): IsbnParts;
}

/*
Write three generic helper functions and test them with a `Book[]` array:

- `groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]>` 
  — takes an array and a property name, then returns an object where each key is a distinct value of that property 
  - and each value is an array of matching items
  - Example: grouping books by author.
- `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` 
  — takes an array and a property name, then returns an array containing just that property’s value from each item. 
  - Example: extracting all book titles.
- `merge<T>(base: T, updates: Partial<T>): T` 
  — takes a base object and a partial update, then returns a new object with the updates applied. 
  - Example: applying a `BookUpdatePayload` to a `Book`.

Each function must be fully generic and work for any object type, not just `Book`.
*/

function groupBy<T, K extends keyof T>(
  items: T[],
  key: K,
): Record<string, T[]> {
  var result: Record<string, T[]> = {};
  items.forEach((i) => {
    const k = String(i[key]);
    result[k] = result[k] ?? [];
    result[k].push(i);
  });
  return result;
}

// — takes an array and a property name, then returns an array containing just that property’s value from each item.
// - Example: extracting all book titles.
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  var result: T[K][] = [];
  items.forEach((item) => {
    result.push(item[key]);
  });
  return result;
}

// — takes a base object and a partial update, then returns a new object with the updates applied.
// - Example: applying a `BookUpdatePayload` to a `Book`.
function merge<T>(base: T, updates: Partial<T>): T {
  return { ...base, ...updates };
}

// give some test data for the helper functions
const books: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    isbn: "978-3-16-148410-0",
    author: "F. Scott Fitzgerald",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    isbn: "978-0-06-112008-4",
    author: "George Orwell",
    isAvailable: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "1984",
    isbn: "978-0-452-28423-4",
    author: "George Orwell",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const groupByAuthor = groupBy(books, "author");
// console.log(groupByAuthor);

const extractedTitles = pluck(books, "title");
// console.log(extractedTitles);

const updatedBook = merge(books[0], { id: "ID-123" });
// console.log(updatedBook);

// Stretch goal: type-safe event emitter

class EventEmitter<Events extends Record<string, any>> {
  on<K extends keyof Events>(
    event: K,
    handler: (payload: Events[K]) => void,
  ): void {}

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {}
}

type BookEvents = {
  bookAdded: Book;
  bookRemoved: { id: EntityId };
  searchPerformed: { query: string; resultCount: number };
};

// The compiler should enforce that emit("bookAdded", payload) only accepts a Book as the payload
const payload: Book = {
  id: 1,
  title: "The Great Gatsby",
  isbn: "978-3-16-148410-0",
  author: "F. Scott Fitzgerald",
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const wrongPayload = "This is no book!";
const emitter = new EventEmitter<BookEvents>();
emitter.emit("bookAdded", payload);

// The compiler should enforce that on("searchPerformed", handler) passes { query: string; resultCount: number } to the handler function.
const handler1 = (payload: { query: string; resultCount: number }) => {
  console.log(
    `Search for "${payload.query}" returned ${payload.resultCount} results.`,
  );
};
const handler2 = (payload: { id: EntityId }) => {
  console.log("This should not show because of wrong payload.");
};
emitter.on("searchPerformed", handler1);

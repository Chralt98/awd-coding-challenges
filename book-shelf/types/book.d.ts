/*
- A type alias `EntityId` that accepts either a `number` or a `string`
- A type `Timestamped` with `createdAt: Date` and `updatedAt: Date`
- A type `HasId` with `id: EntityId`
- A `Book` type that combines `HasId`, `Timestamped`, and book-specific fields (`title`, `author`, `isbn`, `isAvailable`) using intersection types
- A tuple type `IsbnParts` representing the three components of an ISBN: group (number), publisher (string), and title identifier (string)
*/

export type EntityId = number | string;
export type Timestamped = { createdAt: Date; updatedAt: Date };
export type HasId = { id: EntityId };

export type Book = HasId &
  Timestamped & {
    title: string;
    author: string;
    isbn: string;
    isAvailable: boolean;
  };

// group, publisher, title identifier
export type IsbnParts = [number, string, string];

/*
Derive these using utility types (no property repetition):

- `BookCreatePayload` — all `Book` properties except `id`, `createdAt`, and `updatedAt`.
- `BookUpdatePayload` — same as `BookCreatePayload`, but every field optional.
- `BookPreview` — only `id`, `title`, and `author` from `Book`.
*/

export type BookCreatePayload = Omit<Book, "id" | "createdAt" | "updatedAt">;
export type BookUpdatePayload = Partial<BookCreatePayload>;
export type BookPreview = Pick<Book, "id" | "title" | "author">;

/*
Define a generic ApiResponse<T> interface with status: number, message: string, and data: T.
*/
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

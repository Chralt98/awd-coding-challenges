interface Book {
  id: string;
  title: string;
  subtitle: string;
  authors: string;
  image: string;
  url: string;
}

interface SearchResult {
  status: string;
  total: string;
  books: Book[];
}

const API_URL = "https://www.dbooks.org/api/search/";

async function fetchBooks(term: string): Promise<Book[] | undefined> {
  try {
    const response = await fetch(API_URL + term);
    const data = (await response.json()) as SearchResult;
    return data.books || [];
  } catch (error) {
    console.error("Error fetching books: ", error);
  }
}

const searchForm = document.getElementById("search-form") as HTMLFormElement;
const bookList = document.getElementById("book-list") as HTMLUListElement;

function createBookListItem(book: Book): HTMLLIElement {
  const listItem = document.createElement("li");
  listItem.innerHTML = `${book.title} by ${book.authors.split(",")[0]}`;
  return listItem;
}

// Add a submit listener to the form. In the callback, annotate the event parameter with the correct submit event type.
searchForm.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  // Clear previous results
  bookList.innerHTML = "";

  const formElement = event.target as HTMLFormElement;
  const formData = new FormData(formElement);
  const queryValue = formData.get("query") as string;
  console.log('Form value (using .get("query"): ' + queryValue);
  //   const queryValue2 = Object.fromEntries(formData.entries()).query;
  //   console.log("Form value (same using Object.fromEntries): " + queryValue2);

  const books = await fetchBooks(queryValue);
  if (!books || books.length === 0) {
    bookList.append("No books found");
    console.log("No books found");
    return;
  }

  books
    .map((book) => createBookListItem(book))
    .forEach((listItem) => bookList.append(listItem));
  console.log("Form submitted");
});

// document.addEventListener("keydown", (event: KeyboardEvent) => {
//   console.log(event.key);
// });

// Objective: Display a message when a button is clicked.
const helloButton = document.getElementById("helloBtn") as HTMLButtonElement;
const outputParagraph = document.getElementById(
  "output",
) as HTMLParagraphElement;
helloButton.addEventListener("click", (_event: MouseEvent) => {
  outputParagraph.append("Hello from TypeScript! ");
});

// Objective: Capture user input and display it on screen.
const nameInput = document.getElementById("nameInput") as HTMLInputElement;
const submitButton = document.getElementById("submitBtn") as HTMLButtonElement;
const nameParagraph = document.getElementById(
  "displayName",
) as HTMLParagraphElement;
submitButton.addEventListener("click", (_event: MouseEvent) => {
  nameParagraph.innerHTML = "";
  const name = nameInput.value;
  nameInput.value = "";
  nameParagraph.innerHTML = name;
  console.log(`Submitted the name ${name} successfully.`);
});

// Objective: Hide or show a paragraph with a button click.
const toggleButton = document.getElementById("toggleBtn") as HTMLButtonElement;
const hiddenTextParagraph = document.getElementById(
  "hiddenText",
) as HTMLParagraphElement;
toggleButton.addEventListener("click", (_event: MouseEvent) => {
  hiddenTextParagraph.style.display =
    hiddenTextParagraph.style.display === "none" ? "block" : "none";
});

// Objective: Dynamically add list items based on input.
const itemInput = document.getElementById("itemInput") as HTMLInputElement;
const addButton = document.getElementById("addBtn") as HTMLButtonElement;
const itemList = document.getElementById("itemList") as HTMLUListElement;

addButton.addEventListener("click", (event: MouseEvent) => {
  const inputText = itemInput.value;
  const listItem = document.createElement("li");
  listItem.textContent = inputText + " ";
  // Objective: Add a delete button next to each list item and remove on click.
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => listItem.remove());
  listItem.appendChild(delBtn);
  itemList.appendChild(listItem);
});

// Objective: Create a counter app with “+” and “−” buttons.
const incrementButton = document.getElementById(
  "increaseBtn",
) as HTMLButtonElement;
const decrementButton = document.getElementById(
  "decreaseBtn",
) as HTMLButtonElement;
const spanCounter = document.getElementById("counter") as HTMLSpanElement;

type Operator = "increment" | "decrement";

function updateCounter(op: Operator) {
  try {
    const counter = parseInt(spanCounter.innerText!);
    spanCounter.innerText = `${op === "increment" ? counter + 1 : counter - 1}`;
  } catch (error) {
    console.error(error);
  }
}

incrementButton.addEventListener("click", (event: MouseEvent) => {
  updateCounter("increment");
});

decrementButton.addEventListener("click", (event: MouseEvent) => {
  updateCounter("decrement");
});

// Objective: Change the background color of a div using a dropdown.
const selector = document.getElementById("colorSelect") as HTMLSelectElement;
const colorBox = document.getElementById("colorBox") as HTMLDivElement;
selector.addEventListener("change", (event: Event) => {
  const value = (event.currentTarget as HTMLSelectElement).value;
  colorBox.style.backgroundColor = value;
});

// Objective: Display a real-time character count from a textarea.
const textAreaInput = document.getElementById(
  "textInput",
) as HTMLTextAreaElement;
const charCount = document.getElementById("charCount") as HTMLParagraphElement;
textAreaInput.addEventListener("input", (event: InputEvent) => {
  const value = (event.currentTarget as HTMLTextAreaElement).value;
  charCount.innerText = `${value.length} characters`;
});

/*
Objective: Build a basic to-do list with the ability to:

- Add tasks
- Mark them as done
- Remove tasks
*/

const todoInput = document.getElementById("todoInput") as HTMLInputElement;
const addTodo = document.getElementById("addTodo") as HTMLButtonElement;
const todoList = document.getElementById("todoList") as HTMLUListElement;
addTodo.addEventListener("click", (event: MouseEvent) => {
  const inputText = todoInput.value;
  const listItem = document.createElement("li");
  listItem.textContent = inputText + " ";
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => listItem.remove());
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.addEventListener("change", () => {
    listItem.style.textDecoration = checkBox.checked ? "line-through" : "none";
  });
  listItem.appendChild(checkBox);
  listItem.appendChild(delBtn);
  todoList.appendChild(listItem);
});

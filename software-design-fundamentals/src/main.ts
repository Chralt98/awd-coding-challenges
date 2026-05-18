let inputValue = "";
let backStack: string[] = [];
let forwardStack: string[] = [];

function updateButtonStates() {
  undoButton.disabled = backStack.length === 0;
  redoButton.disabled = forwardStack.length === 0;
}

const inputField = document.getElementById("inputField") as HTMLInputElement;
const undoButton = document.getElementById("undoBtn") as HTMLButtonElement;
const redoButton = document.getElementById("redoBtn") as HTMLButtonElement;

inputField.addEventListener("input", (event: InputEvent) => {
  console.log("Input data:", event.data);
  backStack.push(inputValue);
  inputValue = inputField.value;
  forwardStack = [];
  updateButtonStates();
});

undoButton.addEventListener("click", () => {
  console.log("Undo button clicked");
  if (backStack.length > 0) {
    forwardStack.push(inputField.value);
    const topOfBack = backStack.pop()!;
    inputField.value = topOfBack;
  }
  updateButtonStates();
});

redoButton.addEventListener("click", () => {
  console.log("Redo button clicked");
  if (forwardStack.length > 0) {
    backStack.push(inputField.value);
    const topOfForward = forwardStack.pop()!;
    inputField.value = topOfForward;
  }
  updateButtonStates();
});

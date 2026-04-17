type Ingredient = {
  name: string;
  amountGrams: number;
};

type Recipe = {
  name: string;
  servings: number;
  vegetarian: boolean;
  ingredients: Ingredient[];
};

let spaghetti: Ingredient = {
  name: "Spaghetti",
  amountGrams: 500,
};

let mincemeat: Ingredient = {
  name: "mincemeat",
  amountGrams: 250,
};

let recipe1: Recipe = {
  name: "Spaghetti Bolognese",
  servings: 2,
  vegetarian: false,
  ingredients: [spaghetti, mincemeat],
};

let cheese: Ingredient = {
  name: "cheese",
  amountGrams: 100,
};

let tomato: Ingredient = {
  name: "tomato",
  amountGrams: 150,
};

let dough: Ingredient = {
  name: "wheat dough",
  amountGrams: 300,
};

let recipe2: Recipe = {
  name: "Pizza Margaritha",
  servings: 1,
  vegetarian: true,
  ingredients: [dough, tomato, cheese],
};

function summarize(recipe: Recipe): string {
  return `${recipe.name} has ${recipe.servings} servings, ${recipe.vegetarian ? "is" : "is not"} vegetarian and consists of ${recipe.ingredients.map((i) => i.amountGrams + " grams of " + i.name).join(", ")}`;
}

console.log(summarize(recipe1));
console.log(summarize(recipe2));

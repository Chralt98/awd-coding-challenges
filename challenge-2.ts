/*
You don’t want that shown on your screen.

Your task is to write a function maskify, which changes all but the last four characters into ‘#’. Examples (input –> output):

"4556364607935616" --> "############5616"
     "64607935616" -->      "#######5616"
               "1" -->                "1"
                "" -->                 ""
"Skippy" --> "##ippy"
"Nananananananananananananananana Batman!" --> "####################################man!"
*/

const LAST_VISIBLE_CHAR_NUMBER = 4;

function maskify(input: string): string {
  const inputLength = input.length;
  if (input.length < LAST_VISIBLE_CHAR_NUMBER) {
    return input;
  }
  const lastFour = input.slice(-LAST_VISIBLE_CHAR_NUMBER);
  return "#".repeat(inputLength - LAST_VISIBLE_CHAR_NUMBER) + lastFour;
}

console.log(maskify("4556364607935616"));
console.log(maskify("64607935616"));
console.log(maskify("1"));
console.log(maskify(""));
console.log(maskify("Skippy"));
console.log(maskify("Nananananananananananananananana Batman!"));

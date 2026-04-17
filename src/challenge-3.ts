/*
Your task is to sort a given string. Each word in the string will contain a single number. This number is the position the word should have in the result.

Note: Numbers can be from 1 to 9. So 1 will be the first word (not 0).

If the input string is empty, return an empty string. The words in the input String will only contain valid consecutive numbers.

Examples:

"is2 Thi1s T4est 3a"  -->  "Thi1s is2 3a T4est"
"4of Fo1r pe6ople g3ood th5e the2"  -->  "Fo1r the2 g3ood 4of th5e pe6ople"
""  -->  ""
*/

interface WordListWithNumber {
  num: number;
  word: string;
}

function sortWordsByInnerNumber(wordList: string): string {
  if (wordList === "") return "";
  let wordListWithNumber: WordListWithNumber[] = [];

  const words = wordList.split(" ");
  words.forEach((w) => {
    for (let i = 0; i < w.length; i++) {
      const num = Number(w[i]);
      if (isNaN(num)) {
        continue;
      }
      if (num === 0)
        throw new Error(`Numbers can only be from 1 to 9, but not zero`);
      wordListWithNumber.push({ num, word: w });
    }
  });

  wordListWithNumber.sort((a, b) => a.num - b.num);

  return wordListWithNumber.map((w) => w.word).join(" ");
}

console.log(sortWordsByInnerNumber("is2 Thi1s T4est 3a"));
console.log(sortWordsByInnerNumber("4of Fo1r pe6ople g3ood th5e the2"));
console.log(sortWordsByInnerNumber(""));

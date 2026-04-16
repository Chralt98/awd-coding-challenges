/*
# Find the missing letter

Write a method that takes an array of consecutive (increasing) letters as input and that returns the missing letter in the array.

You will always get an valid array. And it will be always exactly one letter be missing. The length of the array will always be at least 2. The array will always contain letters in only one case.
*/

class MissingLetterFinder {
  static letterToNumber(letter: string): number {
    return letter.toUpperCase().charCodeAt(0) - "A".charCodeAt(0) + 1;
  }

  static numberToLetter(code: number): string {
    return "abcdefghijklmnopqrstuvwxyz".charAt(code);
  }

  static findMissingLetter(charArray: string[]): string {
    for (let i = 0; i < charArray.length; i++) {
      const currentChar = charArray[i];
      const nextChar = charArray[i + 1];
      if (
        nextChar &&
        this.letterToNumber(currentChar!) + 1 !== this.letterToNumber(nextChar)
      ) {
        return this.numberToLetter(this.letterToNumber(currentChar!) + 1);
      }
    }
    throw new Error(
      `It will be always exactly one letter be missing, but this was not the case here.`,
    );
  }
}

console.log(MissingLetterFinder.findMissingLetter(["a", "b", "c", "d", "f"]));
console.log(MissingLetterFinder.findMissingLetter(["O", "Q", "R", "S"]));

/*
# Find the missing letter

Write a method that takes an array of consecutive (increasing) letters as input and that returns the missing letter in the array.

You will always get an valid array. And it will be always exactly one letter be missing. The length of the array will always be at least 2. The array will always contain letters in only one case.
*/

class MissingLetterFinder {
  static letterToNumber(ch: string): number {
    if (!ch || ch.length !== 1) return 0;
    const c = ch.toUpperCase().charCodeAt(0);
    return c >= 65 && c <= 90 ? c - 64 : 0;
  }

  static numberToLetter(code: number): string {
    return "abcdefghijklmnopqrstuvwxyz".charAt(code);
  }

  static findMissingLetter(charArray: string[]): string {
    for (let i = 0; i < charArray.length; i++) {
      const currentChar = charArray[i]!.toUpperCase();
      const nextChar = charArray[i + 1];
      if (nextChar && currentChar) {
        if (
          this.letterToNumber(currentChar) + 1 !==
          this.letterToNumber(nextChar)
        )
          return this.numberToLetter(this.letterToNumber(currentChar));
      }
    }
    throw new Error(
      `It will be always exactly one letter be missing, but this was not the case here.`,
    );
  }
}

console.log(MissingLetterFinder.findMissingLetter(["a", "b", "c", "d", "f"]));
console.log(MissingLetterFinder.findMissingLetter(["O", "Q", "R", "S"]));

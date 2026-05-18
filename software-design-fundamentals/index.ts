/*

// snippet 1
function first(arr) {
  return arr[0];
}

The above function has the Big O notation of O(1), because it accesses one specific element in the array, regardless of the size of the array.
This means that the time it takes to execute this function is constant, as it does not depend on the number of elements in the array.

// snippet 2
function second(arr) {
  let total = 0;
  for (const value of arr) {
    total += value;
  }
  return total;
}

The second function has the Big O notation of O(n), because it iterates through each element in the array once to calculate the total. 
The time it takes to execute this function increases linearly with the size of the array, as it needs to process each element to compute the sum.

// snippet 3
function third(arr) {
  for (const a of arr) {
    for (const b of arr) {
      if (a === b) console.log(a);
    }
  }
}

The third function has the Big O notation of O(n^2), because it contains a nested loop that iterates through the array twice.
The time it takes to execute this function increases quadratically with the size of the array, as it compares each element with every other element in the array.

// snippet 4
function fourth(arr) {
  for (const value of arr) {
    for (let i = 0; i < 10; i++) {
      console.log(value, i);
    }
  }
}

The fourth function has the Big O notation of O(n), because the inner loop runs a constant number of times (10) for each element in the array.
The time it takes to execute this function increases linearly with the size of the array, as it processes each element in the array while the inner loop runs a fixed number of times.
The outer for loop contributes O(n) to the overall time complexity, while the inner loop contributes O(1), resulting in a total time complexity of O(n * 1) = O(n).
This is because the outer fot loop will dominate the time complexity as it grows with the size of the input array, while the inner loop's contribution remains constant regardless of the input size.

// snippet 5
function fifth(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return [...fifth(arr.slice(0, mid)), ...fifth(arr.slice(mid))];
}

The fifth function has the Big O notation of O(n log n), because it uses a divide-and-conquer approach to recursively split the array into halves until it reaches arrays of length 1 or 0.
The time it takes to execute this function increases logarithmically with the size of the array due to the recursive splitting, and each level of recursion processes all elements in the array, resulting in a total time complexity of O(n log n).
*/

/* 

#### Insertion Sort

Insertion sort builds a sorted region at the front of the array, one element at a time. 
Walk through the array starting from the second element. 
For each element, slide it to the left past every larger element until it lands in the right place among the already-sorted region. 
By the time the outer loop has visited every element, the whole array is sorted.

The pseudo code for this algorithm reads like this:

```text
for i from 1 to length(arr) - 1:
  current = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > current:
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = current
```

The inner while loop shifts larger elements one position to the right to make room. When it exits, the gap at arr[j+1] is the correct spot for current.

The worst case is O(n²), on an array sorted in reverse, where every new element has to be slid all the way to the front.
The best case is O(n), on an already-sorted array, because the inner loop exits on the first comparison. 
That sensitivity to how sorted the input already is makes insertion sort a strong choice for small arrays and for arrays that are nearly sorted. 
It is also in-place: aside from a single temporary variable, it needs no extra memory.

This is the reason TimSort uses insertion sort for the small chunks it has to sort before merging them. On inputs of length 32 or so, a simple algorithm with low constant factors beats anything fancier.

#### Implement Insertion Sort

Write an `insertionSort` function that takes an array of numbers and returns it sorted in ascending order. 
Match the algorithm from the algorithms file: 
walk the array from the second element onwards, and for each element, slide it left past every larger value until it lands in the right place.

```js
function insertionSort(arr) {
  // your code here
}

console.log(insertionSort([5, 2, 4, 6, 1, 3]));
// -> [1, 2, 3, 4, 5, 6]
```

#### Questions To Decide

- whether to mutate the input array or work on a copy
- how the inner loop knows when to stop sliding the current value
- what happens for an empty array or an array of length one

Once it works, test it on three inputs and count how many comparisons it makes for each:

- an already-sorted array, e.g. `[1, 2, 3, 4, 5]`
- a reverse-sorted array, e.g. `[5, 4, 3, 2, 1]`
- a single-element array `[42]`

The already-sorted and single-element cases should be cheap. 
The reverse-sorted case should be expensive. That gap is what the algorithms file means when it says insertion sort is `O(n²)` worst case but `O(n)` best case.
*/

function insertionSort(arr: Array<number>): Array<number> {
  let comparisons = 0;
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i]!;
    let j = i - 1;
    while (j >= 0 && arr[j]! > current) {
      comparisons++;
      arr[j + 1] = arr[j]!;
      j = j - 1;
    }
    arr[j + 1] = current;
  }
  console.log(`Total comparisons: ${comparisons}`);
  return arr;
}

console.log(insertionSort([5, 2, 4, 6, 1, 3])); // -> [1, 2, 3, 4, 5, 6]
console.log(insertionSort([1, 2, 3, 4, 5])); // should be cheap with `O(n)`
console.log(insertionSort([5, 4, 3, 2, 1])); // should be expensive with `O(n²)`
console.log(insertionSort([42]));

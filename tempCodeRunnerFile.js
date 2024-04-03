function shuffle(array) {
  let index = array.length;
  while (arrLength != 0) {
    let randIndex = Math.floor(Math.random() * index);
    index--;
    [array[index], array[randIndex]] = [array[randIndex], array[index]];
  }
}

let testArr = [1, 2, 3];
console.log(([testArr[1], testArr[2]] = [testArr[2], testArr[1]]));
console.log(testArr);

function Random() {};

Random.random = function (start, end) {
  return Math.floor(
    (Math.random() * (end || 10)) + (start || 0)
  );
};

Random.randomCollection = function (collectionCount, start, end) {
  // https://stackoverflow.com/questions/2380019/generate-unique-random-numbers-between-1-and-100
  let arr = [];

  while ( arr.length < collectionCount ) {
    const number = Random.random(start, end);

    if ( arr.indexOf(number) > -1 ) continue;

    arr.push(number);
  }

  return arr;
};

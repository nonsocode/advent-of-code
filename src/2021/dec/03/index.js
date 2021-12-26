import input from "./input.json";

const ZERO = "0";
const ONE = "1";
const getGammaBits = (input) => {
  const columnCount = input[0].length;
  const gammaBits = [];
  for (let i = 0; i < columnCount; i++) {
    let zeroCount = (oneCount = 0);
    for (j = 0; j < input.length; j++) {
      input[j][i] === ZERO ? zeroCount++ : oneCount++;
    }
    gammaBits.push(zeroCount > oneCount ? ZERO : ONE);
  }
  return gammaBits;
};

const flipGammaBits = (bits) => bits.map((bit) => (bit === ZERO ? ONE : ZERO));
const decimalValue = (bits) =>
  (typeof bits === "string" ? bits.split("") : bits)
    .map((bit, i) => (bit === ZERO ? 0 : 2 ** Number(bits.length - 1 - i)))
    .reduce((a, b) => a + b);

const part1 = (input) => {
  const bits = getGammaBits(input);
  const flipped = flipGammaBits(bits);
  return decimalValue(bits) * decimalValue(flipped);
};

const createFilter = (input, index, superior) => {
  let ones = 0,
    zerors = 0,
    match;
  input.forEach((item) => (item[index] === ZERO ? zerors++ : ones++));
  if (superior === ONE) {
    match = ones >= zerors ? ONE : ZERO;
  } else {
    match = zerors <= ones ? ZERO : ONE;
  }
  return (number) => number[index] === match;
};

const reduce = (input, superior) => {
  for (let i = 0, length = input[0].length; input.length > 1 && i < length; i++)
    input = input.filter(createFilter(input, i, superior));
  return input[0];
};

const part2 = (input) =>
  [ONE, ZERO]
    .map((num) => reduce(input, num))
    .map(decimalValue)
    .reduce((acc, i) => acc * i);

console.log(part2(input));

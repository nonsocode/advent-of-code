import { readFile } from "fs/promises";
const parse = async () =>
  (await readFile(new URL("input.txt", import.meta.url)))
    .toString()
    .split("\n")
    .map((line) =>
      line
        .split("|")
        .map((str) => str.trim())
        .map((parts) => parts.split(" "))
    );
const uniqueCounts = new Set([2, 4, 3, 7]);
const hash = (sequence) =>
  (typeof sequence === "string" ? sequence.split("") : sequence)
    .sort()
    .join("");

const lines = await parse();
const part1 = () =>
  lines.reduce(
    (acc, [, outputs]) =>
      acc + outputs.filter((output) => uniqueCounts.has(output.length)).length,
    0
  );

/*
  0:6     1:2     2:5     3:5     4:4
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....
  5:5      6:6     7:3     8:7     9:6
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
*/

const getScrampbledNumbers = (lengthSequenceMap) => {
  let [one, four, seven, eight] = [...uniqueCounts].map(
    (length) => lengthSequenceMap[length][0]
  );

  let three = lengthSequenceMap[5].find((sequence) =>
    one.every((char) => sequence.includes(char))
  );
  let twoAndFive = lengthSequenceMap[5].filter(
    (sequence) => sequence !== three
  );
  let five = twoAndFive.find(
    (sequence) => sequence.filter((char) => four.includes(char)).length === 3
  );
  let two = twoAndFive.find((sequence) => five !== sequence);
  let nine = lengthSequenceMap[6].find((sequence) =>
    four.every((char) => sequence.includes(char))
  );
  let zero = lengthSequenceMap[6].find(
    (sequence) =>
      sequence !== nine && seven.every((char) => sequence.includes(char))
  );
  let six = lengthSequenceMap[6].find(
    (sequence) => ![nine, zero].includes(sequence)
  );
  return [zero, one, two, three, four, five, six, seven, eight, nine];
};

const createMap = (input) => {
  return Object.fromEntries(
    getScrampbledNumbers(
      input.reduce(
        (acc, sequence) => (
          (acc[sequence.length] ??= []).push(sequence.split("")), acc
        ),
        {}
      )
    ).map((sequence, index) => [hash(sequence), index])
  );
};
const part2 = () =>
  lines
    .map(([inputs, outputs]) => [createMap(inputs), outputs])
    .map(([map, outputs]) =>
      Number(outputs.reduce((str, output) => `${str}${map[hash(output)]}`, ""))
    )
    .reduce((acc, num) => acc + num, 0);

console.log(part1(), part2());

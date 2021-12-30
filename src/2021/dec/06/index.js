import { readFile } from "fs/promises";

const parse = async (fileName) => {
  const data = (
    await readFile(new URL("input.txt", import.meta.url))
  ).toString();
  return data.split(",").map(Number);
};

const solve = (data, days) => {
  const counts = data.reduce((acc, i) => {
    acc[i] = (acc[i] ?? 0) + 1;
    return acc;
  }, []);

  while (days > 0) {
    const zeros = counts[0] ?? 0;
    for (let i = 1; i <= 8; i++) {
      counts[i - 1] = counts[i] ?? 0;
    }
    counts[6] += zeros;
    counts[8] = zeros;
    days--
  }
  return Object.values(counts).reduce((acc, c) => acc + c, 0);
};
const part1 = (data) => solve(data, 80)
const part2 = (data) => solve(data, 256)
const data = await parse();
console.log(part1(data), part2(data));

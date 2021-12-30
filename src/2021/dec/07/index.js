import { readFile } from "fs/promises";

const parse = async () =>
  (await readFile(new URL("input.txt", import.meta.url)))
    .toString()
    .split(",")
    .map(Number);

const minMax = (arr, valueChecker = (item) => item) => {
  let min = Infinity,
    max = -Infinity;
  arr.forEach((item) => {
    min = valueChecker(item) < min ? item : min;
    max = valueChecker(item) > max ? item : max;
  });
  return [min, max];
};

const minCost = (
  items,
  costFn = (target, currentPos) => Math.abs(target - currentPos)
) => {
  const [min, max] = minMax(items);
  let cost = Infinity;
  for (let i = min; i < max; i++) {
    let currentCost = items.reduce((acc, item) => acc + costFn(i, item), 0);
    cost = currentCost < cost ? currentCost : cost;
  }
  return cost;
};
const data = await parse();
const part1 = () => minCost(data);
const part2 = () =>
  minCost(data, (target, curr) => {
    let diff = Math.abs(target - curr),
      cost = diff;
    while (--diff > 0) {
      cost += diff;
    }
    return cost;
  });
console.log(part1(), part2());

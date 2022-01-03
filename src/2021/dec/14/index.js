import { readFile } from "fs/promises";
const parse = async () => {
  const string = (
    await readFile(new URL("input.txt", import.meta.url))
  ).toString();
  const [template, rawMapping] = string.split("\n\n");
  return {
    template,
    map: rawMapping.split("\n").reduce((acc, pair) => {
      const [key, value] = pair.split(" -> ");
      acc[key] = value;
      return acc;
    }, {}),
  };
};

const computePolymer = ({ template, map }, steps) => {
  // too slow for part 2
  while (steps--) {
    let newPolymer = "";
    for (let i = 0; i < template.length - 1; i++) {
      const sub = template.substring(i, i + 2);
      newPolymer += sub[0] + map[sub];
    }
    template = newPolymer + template.slice(-1);
  }
  return {
    getMinMax() {
      return minMax(Object.values(groupPolymerElements(template)));
    },
  };
};
const countChars = (compiledTemplate) =>
  Object.entries(compiledTemplate).reduce((acc, [key, val], i) => {
    const [key1, key2] = key.split("");
    if (!i) acc[key1] = 1;
    acc[key2] = (acc[key2] ?? 0) + val;
    return acc;
  }, {});

const computePolymerOptimized = ({ template, map }, steps) => {
  let compiledTemplate = groupPolymerElements(template, 2);
  while (steps--) {
    compiledTemplate = Object.entries(compiledTemplate).reduce(
      (acc, [key, val]) => {
        const emplace = map[key];
        if (!emplace) return acc;
        const key1 = `${key[0]}${emplace}`;
        const key2 = `${emplace}${key[1]}`;
        acc[key1] = (acc[key1] ?? 0) + val;
        acc[key2] = (acc[key2] ?? 0) + val;
        return acc;
      },
      {}
    );
  }
  return {
    getMinMax() {
      return minMax(Object.values(countChars(compiledTemplate)));
    },
  };
};

const groupPolymerElements = (polymer, windowSize = 1) => {
  const group = {};
  for (let i = 0; i < polymer.length - windowSize + 1; i++) {
    const key = polymer.substring(i, i + windowSize);
    group[key] = (group[key] ?? 0) + 1;
  }
  return group;
};
const minMax = (arr, valueChecker = (item) => item) => {
  let min = Infinity,
    max = -Infinity;
  arr.forEach((item) => {
    min = valueChecker(item) < min ? item : min;
    max = valueChecker(item) > max ? item : max;
  });
  return [min, max];
};

const solve = async (steps) => {
  let ctx = await parse();
  const [min, max] = computePolymerOptimized(ctx, steps).getMinMax();
  return max - min;
};

const part1 = () => solve(10);
const part2 = () => solve(40);
console.log(await part2());

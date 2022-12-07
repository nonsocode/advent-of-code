import { readFile } from "fs/promises";

const parse = async (inputPath) => {
  const data = (await readFile(new URL(inputPath, import.meta.url))).toString();
  return data.split("\n").map((line) => {
    return line.split(/\s->\s/).map((pair) => {
      return pair.split(",").map(Number);
    });
  });
};
const filterLines = (lines) =>
  lines.filter(([a, b]) => a[0] === b[0] || a[1] === b[1]);

const createStore = () => {
  const store = new Map();
  return {
    set([x, y]) {
      let xMap;
      if (store.has(x)) {
        xMap = store.get(x);
      } else {
        xMap = new Map();
        store.set(x, xMap);
      }

      xMap.set(y, xMap.has(y) ? xMap.get(y) + 1 : 1);
    },
    overlapPoints() {
      return [...store.values()]
        .map((map) => [...map.values()].filter((val) => val > 1).length)
        .reduce((a, b) => a + b, 0);
    },
  };
};

const input = await parse("input.txt");

const part1 = () => walk(filterLines(input)).overlapPoints();
const part2 = () => walk(input, true).overlapPoints();
const walk = (lines, diag = false) => {
  const store = createStore();

  for (let [a, b] of lines) {
    if (a[0] === b[0]) {
      for (
        let i = Math.min(a[1], b[1]), term = Math.max(a[1], b[1]);
        i <= term;
        i++
      ) {
        store.set([a[0], i]);
      }
    } else if (a[1] === b[1]) {
      for (
        let i = Math.min(a[0], b[0]), term = Math.max(a[0], b[0]);
        i <= term;
        i++
      ) {
        store.set([i, a[1]]);
      }
    }
    if (diag) {
      let xDir = Math.sign(b[0] - a[0]);
      let yDir = Math.sign(b[1] - a[1]);

      for (
        let x = a[0], y = a[1];
        (xDir > 0 ? x <= b[0] : b[0] <= x) &&
        (yDir > 0 ? y <= b[1] : b[1] <= y);
        x += xDir, y += yDir
      ) {
        store.set([x, y]);
      }
    }
  }
  return store;
};

console.log(part2());

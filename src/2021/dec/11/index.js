import { readFile } from "fs/promises";
const parse = async () =>
  (await readFile(new URL("input.txt", import.meta.url)))
    .toString()
    .split("\n")
    .map((line) => line.split(""));

const createAdjacentGetter = (height, width) => {
  const horizontals = [
    { check: (i, j) => j > 0, getIndex: (i, j) => [i, j - 1] }, // left
    { check: (i, j) => j < width - 1, getIndex: (i, j) => [i, j + 1] }, //right
  ];
  const verticals = [
    { check: (i, j) => i > 0, getIndex: (i, j) => [i - 1, j] }, //top
    { check: (i, j) => i < height - 1, getIndex: (i, j) => [i + 1, j] }, //bottom
  ];

  const diags = horizontals.flatMap((horizontal) =>
    verticals.map((vertical) => ({
      check: (i, j) => [vertical, horizontal].every((axis) => axis.check(i, j)),
      getIndex: (i, j) => {
        [[i], [, j]] = [vertical, horizontal].map((axis) =>
          axis.getIndex(i, j)
        );
        return [i, j];
      },
    }))
  );

  return ([i, j], withDiags = true) =>
    [...horizontals, ...verticals, ...(withDiags ? diags : [])]
      .filter(({ check }) => check(i, j))
      .map(({ getIndex }) => getIndex(i, j));
};

const createQueue = () => {
  const list = [];

  return {
    has([i, j]) {
      return list.some(([ii, jj]) => i === ii && j === jj);
    },
    enqueue(items = []) {
      list.push(...items);
    },
    work(fn) {
      let current;
      while ((current = list.shift())) {
        fn(current);
      }
    },
  };
};

const solve = async (limit = Infinity) => {
  const grid = await parse();
  const getAdjacents = createAdjacentGetter(grid.length, grid[0].length);
  const gridSize = grid.length * grid[0].length;
  let iteration = 0;
  let total = 0;
  while (++iteration <= limit) {
    const flashed = new Set();
    const queue = createQueue();
    const isFlashed = (index) => flashed.has(index.join());
    const processCell = ([i, j]) => {
      if (isFlashed([i, j])) return;
      if (grid[i][j] === 9) {
        grid[i][j] = 0;
        flashed.add([i, j].join());
        queue.enqueue(getAdjacents([i, j]));
        return;
      }
      grid[i][j]++;
    };
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        processCell([i, j]);
        queue.work((index) => {
          processCell(index);
        });
      }
    }
    if (limit === Infinity && flashed.size === gridSize) return iteration;
    total += flashed.size;
  }
  return total;
};

const part1 = () => solve(100);
const part2 = () => solve();
const printGrid = (grid) => {
  const defaultStyle = "color:#888;";
  const flashedStyle = "color:#fff; font-wight: bold";
  for (const row of grid) {
    let string = "";
    const cellStyles = [];
    for (const cell of row) {
      string += `%c${cell}`;
      cellStyles.push(cell === 0 ? flashedStyle : defaultStyle);
    }
    console.log(string, ...cellStyles);
  }
};
console.log(await part2());

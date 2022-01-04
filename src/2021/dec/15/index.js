import { readFile } from "fs/promises";
import { blue, green } from "../../../log.js";
const parse = async () => {
  const string = (
    await readFile(new URL("input.txt", import.meta.url))
  ).toString();
  return string.split("\n").map((line) => line.split("").map(Number));
};
const dimensions = (grid) => [grid.length, grid[0].length];
const estimateDistance = ([i, j], h, w) => h - 1 - i + (w - 1 - j);
const compileGrid = (grid) => {
  const [height, width] = dimensions(grid);
  return grid.map((line, i) =>
    line.map((value, j) => {
      const isStart = i === 0 && j === 0;
      const estimatedDistance = estimateDistance([i, j], height, width);
      const distanceFromStart = isStart ? 0 : Infinity;
      const score = estimatedDistance + distanceFromStart;
      return {
        value,
        score,
        isStart,
        distanceFromStart,
        estimatedDistance,
        index: [i, j],
        closed: false,
        hash: `${i},${j}`,
        isEnd: i === height - 1 && j === width - 1,
        previous: null,
      };
    })
  );
};

const createAdjacentGetter =
  (grid) =>
  ([i, j]) => {
    const [height, width] = dimensions(grid);
    return [
      { check: (i, j) => j > 0, getIndex: (i, j) => [i, j - 1] },
      { check: (i, j) => j < width - 1, getIndex: (i, j) => [i, j + 1] }, //right
      { check: (i, j) => i > 0, getIndex: (i, j) => [i - 1, j] },
      { check: (i, j) => i < height - 1, getIndex: (i, j) => [i + 1, j] },
    ]
      .filter(({ check }) => check(i, j))
      .map(({ getIndex }) => {
        const [newi, newj] = getIndex(i, j);
        return grid[newi][newj];
      });
  };
const findCandidate = (set) => {
  if (set.size === 0) return;
  const arr = [...set];
  if (arr.length === 1) return arr[0];
  return arr.sort((a, b) => a.score - b.score)[0];
};
// A*
const computeShortestPath = (compiled) => {
  const getAdjacents = createAdjacentGetter(compiled);

  let current;
  const openCells = new Set([compiled[0][0]]);
  while ((current = findCandidate(openCells))) {
    if (current.isEnd) {
      return current.distanceFromStart;
    }
    const adjacents = getAdjacents(current.index).filter((adj) => !adj.closed);
    adjacents.forEach((adj) => {
      openCells.add(adj);
      if (adj.distanceFromStart < current.distanceFromStart + adj.value) return;
      adj.distanceFromStart = current.distanceFromStart + adj.value;
      adj.score = adj.estimatedDistance + adj.distanceFromStart;
      adj.previous = current;
    });
    current.closed = true;
    openCells.delete(current);
  }
  return "nothing found";
};
const printGrid = (grid) => {
  const path = new Set();
  let current = grid[grid.length - 1][grid[grid.length - 1].length - 1];
  while (current) {
    path.add(current.hash);
    current = current.previous;
  }
  return grid
    .map((line) =>
      line
        .map(({ value, hash }) => (path.has(hash) ? blue(value) : value))
        .join("")
    )
    .join("\n");
};

const expandGrid = (grid, size) => {
  const height = grid.length;
  const width = grid[0].length;
  const bigGrid = Array.from(
    { length: height * size },
    () => new Array(width.size)
  );

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let val = grid[y][x] + i + j;
          bigGrid[i * height + y][j * width + x] = val > 9 ? val - 9 : val;
        }
      }
    }
  }
  return bigGrid;
};
const part1 = async () => {
  const compiled = compileGrid(await parse());
  const leastRisk = computeShortestPath(compiled);
  return leastRisk;
};
const part2 = async () => {
  const compiled = compileGrid(expandGrid(await parse(), 5));
  const leastRisk = computeShortestPath(compiled);
  return leastRisk;
};
console.log(await part2());

import { readFile } from "fs/promises";
const parse = async () =>
  (await readFile(new URL("input.txt", import.meta.url)))
    .toString()
    .split("\n")
    .map((line) => line.split("").map(Number));

const grid = await parse();
const createAdjacentGetter = (grid) => {
  const height = grid.length;
  const width = grid[0].length;

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
      .map(({ getIndex }) => {
        const index = getIndex(i, j);
        const [newi, newj] = index;
        return {
          value: grid[newi][newj],
          index: index,
          hash: index.join(),
        };
      });
};

const hash = (index) => index.join();

const part1 = () => {
  const minimas = [];
  const matcher = (adjacent, target) => target < adjacent.value;
  const adjacentGetter = createAdjacentGetter(grid);

  grid.forEach((line, i) => {
    line.forEach((num, j) => {
      if (!adjacentGetter([i, j]).every((adjacent) => matcher(adjacent, num)))
        return;
      minimas.push(num);
    });
  });

  return minimas.map((i) => i + 1).reduce((acc, i) => i + acc, 0);
};

const createBasin = (i, j) => {
  const root = hash([i, j]);
  const set = new Set([root]);

  return {
    addAll: (values) => values.forEach((value) => set.add(value.hash)),
    has: (adjacent) => set.has(adjacent.hash),
    get size() {
      return set.size;
    },
  };
};

const createQueue = (arr = []) => {
  const list = [...arr];
  const set = new Set(list);

  const has = (adjacent) => set.has(adjacent.hash);
  const enqueue = (adjacent) => {
    if (has(adjacent)) return;
    list.push(adjacent);
    set.add(adjacent);
  };
  const dequeue = () => {
    if (!list.length || !set.size) return;
    const adjacent = list.shift();
    set.delete(adjacent.hash);
    return adjacent;
  };
  const enqueueAll = (adjacents) => adjacents.forEach(enqueue);
  return {
    enqueueAll,
    dequeue,
    work(fn) {
      let current;
      while ((current = dequeue())) {
        fn(current, { enqueue, dequeue });
      }
    },
  };
};
const part2 = () => {
  const basins = [];
  const minimaMatcher = (adjacent, target) => target < adjacent.value;
  const notNine = (adjacent) => adjacent.value !== 9;

  const adjacentGetter = createAdjacentGetter(grid);

  grid.forEach((line, i) => {
    line.forEach((num, j) => {
      const adjacents = adjacentGetter([i, j]);
      if (!adjacents.every((adjacent) => minimaMatcher(adjacent, num))) return;
      const basin = createBasin(i, j);
      const startItems = adjacents.filter(notNine);
      basin.addAll(startItems);
      const queue = createQueue(startItems);
      queue.work((current) => {
        const adjacents = adjacentGetter(current.index, false)
          .filter(notNine)
          .filter((adjacent) => !basin.has(adjacent))
          .filter((adjacent) => adjacent.value > current.value);
        basin.addAll(adjacents);
        queue.enqueueAll(adjacents);
      });

      basins.push(basin);
    });
  });
  const [a, b, c] = basins.sort((a, b) => b.size - a.size);
  return [a, b, c].reduce((acc, item) => acc * item.size, 1);
};

console.log(part2());

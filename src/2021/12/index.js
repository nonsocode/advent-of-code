import { readFile } from "fs/promises";
const parse = async () =>
  (await readFile(new URL("input.txt", import.meta.url)))
    .toString()
    .split("\n");
const lines = await parse();
const START = "start";
const END = "end";
const isTerminusName = (name) => [START, END].includes(name);
const createCave = (name) => {
  const children = [];
  return {
    name,
    children,
    isSmall: /[a-z]/.test(name[0]),
    isTerminus: isTerminusName(name),
    visitableChildren: () => children.filter((cave) => cave.name !== START),
  };
};
const createLinkedCaves = (caveNameA, caveNameB, caveMap) => {
  const [caveA, caveB] = [caveNameA, caveNameB].map(
    (name) => (caveMap[name] ??= createCave(name))
  );
  caveA.children.push(caveB);
  caveB.children.push(caveA);
};

const createPath = (start) => {
  let head, tail;
  const createNode = (cave) => ({ cave, next: null, prev: null });
  head = tail = createNode(start);
  return {
    clone() {
      const newPath = createPath(head.cave);
      let current = head.next;
      while (current !== null) {
        newPath.visit(current.cave);
        current = current.next;
      }
      return newPath;
    },
    visit(cave) {
      const newNode = createNode(cave);
      tail.next = newNode;
      newNode.prev = tail;
      tail = newNode;
    },
    canVisitNext(cave, doubleBack = false) {
      if (cave.name === START) return false;
      if (!cave.isSmall || cave.name === END) return true;
      let currentNode = tail;
      let smallCaves = [];
      while (currentNode !== null) {
        if (currentNode.cave === cave && cave.isSmall && !doubleBack) {
          return false;
        }
        if (
          doubleBack &&
          currentNode.cave.isSmall &&
          !currentNode.cave.isTerminus
        ) {
          smallCaves.push(currentNode.cave);
        }
        currentNode = currentNode.prev;
      }
      if (!doubleBack || !cave.isSmall) {
        return true;
      }
      const uniqueSmallCaves = new Set(smallCaves);
      const vistedSmallCaveMulipleTimes =
        smallCaves.length !== uniqueSmallCaves.size;
      return vistedSmallCaveMulipleTimes ? !uniqueSmallCaves.has(cave) : true;
    },
    lastVisitedCave: () => tail.cave,
  };
};
const createQueue = () => {
  const list = [];
  const enqueue = (item) => list.push(item);
  const work = (fn) => {
    let current;
    while ((current = list.shift())) fn(current);
  };
  return {
    enqueue,
    work,
  };
};
const parseCaves = (lines) =>
  lines.reduce((caveMap, line) => {
    const [a, b] = line.split("-");
    createLinkedCaves(a, b, caveMap);
    return caveMap;
  }, {});

const solve = (doubleBackToSmallCave = false) => {
  const caveMap = parseCaves(lines);
  const queue = createQueue();
  let complete = 0;

  queue.enqueue(createPath(caveMap[START]));
  queue.work((path) => {
    const explorableCaves = path.lastVisitedCave().visitableChildren();
    explorableCaves.forEach((cave) => {
      if (!path.canVisitNext(cave, doubleBackToSmallCave)) {
        return;
      }
      const newPath = path.clone();
      newPath.visit(cave);
      if (cave.name === END) {
        complete++;
        return;
      }
      queue.enqueue(newPath);
    });
  });
  return complete;
};

const part1 = () => solve();
const part2 = () => solve(true); // Slow. neets optimization
console.log(part2());

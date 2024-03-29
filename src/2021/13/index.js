import { readFile } from "fs/promises";
const parse = async () => {
  const string = (
    await readFile(new URL("input.txt", import.meta.url))
  ).toString();
  const [rawGridString, rawInstructions] = string.split("\n\n");
  return {
    hashes: rawGridString.split("\n"),
    instructions: rawInstructions.split("\n").map((instruction) => {
      const [axis, index] = instruction.slice("fold along ".length).split("=");
      return [axis, Number(index)];
    }),
  };
};
const toIndex = (hash) => {
  const [x, y] = hash.split(",").map(Number);
  return { x, y };
};
const toHash = ({ x, y }) => `${x},${y}`;

const fold = (hashes, direction, fulcrum) => {
  const reflector = (hash) => {
    const index = toIndex(hash);
    if (index[direction] < fulcrum) return hash;
    index[direction] = 2 * fulcrum - index[direction];
    return toHash(index);
  };
  return Array.from(new Set(hashes.map(reflector)));
};

const solve = async (limit) => {
  let { hashes, instructions } = await parse();
  if (limit) instructions = [...instructions.slice(0, limit)];
  instructions.forEach(([direction, fulcrum]) => {
    hashes = fold(hashes, direction, fulcrum);
  });
  return hashes;
};
const buildSparseGrid = (hashes) =>
  hashes.reduce((grid, hash) => {
    const { x, y } = toIndex(hash);
    grid[y] ??= [];
    grid[y][x] = true;
    return grid;
  }, []);

const getDrawing = (hashes) => {
  const sparseGrid = buildSparseGrid(hashes);
  let lines = [];
  const DOT = " ";
  const HASH = "#";
  const width = Math.max(...sparseGrid.map((row) => row.length));
  for (let row of sparseGrid) {
    if (!row) {
      lines.push(DOT.repeat(width));
      continue;
    }
    let str = "";
    for (let val of row) {
      str += val ? HASH : DOT;
    }
    lines.push(str);
  }
  return lines.join("\n");
};
const part1 = async () => (await solve(1)).length;
const part2 = async () => getDrawing(await solve());
console.log(await part1());
console.log(await part2());

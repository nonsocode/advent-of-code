import { readFile } from "fs/promises";

class Board {
  rows;

  constructor(boardString) {
    this.rows = boardString.split("\n").map((row) =>
      row
        .trim()
        .split(/\s+/)
        .map(Number)
        .map((value) => ({ value, highlighted: false }))
    );
  }
  call(number) {
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.rows[i].length; j++) {
        const cell = this.rows[i][j];
        if (cell.value !== number) continue;
        cell.highlighted = true;
        if (this.hasWon(i, j)) return this;
      }
    }
  }

  hasWon(i, j) {
    return this.checkHorizontal(i) || this.checkVertically(j);
  }

  checkHorizontal(rowNum) {
    return this.rows[rowNum].every((cell) => cell.highlighted);
  }

  checkVertically(col) {
    return this.rows.every((row) => row[col].highlighted);
  }

  getScore(winningNumber) {
    return (
      this.rows
        .flat()
        .filter((cell) => !cell.highlighted)
        .reduce((acc, i) => acc + i.value, 0) * winningNumber
    );
  }
}

const parse = async (inputPath) => {
  const data = await readFile(new URL(inputPath, import.meta.url));
  const [rawNumbers, ...rawGridInfos] = data.toString().split("\n\n");
  const numbers = rawNumbers.split(",").map(Number);
  const boards = rawGridInfos.map((string) => new Board(string));
  return [numbers, boards];
};

const [numbers, boards] = await parse("./input.txt");

const part1 = () => {
  let winningScore;
  for (let number of numbers) {
    for (let board of boards) {
      if (!board.call(number)) continue;
      winningScore = board.getScore(number);
      console.log(winningScore);
      return;
    }
  }
};
const part2 = () => {
  let winningScore,
    winnerBoards = boards,
    allBoards = new Set(boards);
  for (let number of numbers) {
    for (let board of allBoards) {
      if (!board.call(number)) continue;
      allBoards.delete(board);
      winnerBoards.push([board, number]);
    }
  }
  const [board, number] = winnerBoards.pop();
  return board.getScore(number);
};
console.log(part2());

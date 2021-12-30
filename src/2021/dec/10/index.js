import { readFile } from "fs/promises";
const parse = async () =>
  (await readFile(new URL("input.txt", import.meta.url)))
    .toString()
    .split("\n");
const data = await parse();
const openCloseMap = { "{": "}", "[": "]", "<": ">", "(": ")" };
const closeOpenMap = Object.fromEntries(
  Object.entries(openCloseMap).map(([key, val]) => [val, key])
);

const isOpener = (token) => token in openCloseMap;
const isCloser = (token) => token in closeOpenMap;

const parser = (line) => {
  const stack = [];
  const result = {};
  const tokens = line.split("");

  for (let token of tokens) {
    if (isOpener(token)) {
      stack.push(token);
      continue;
    }
    if (stack.length === 0) {
      throw new Error("stack is empty");
    }
    const opener = stack.pop();
    if (closeOpenMap[token] !== opener) {
      result.illegal = token;
      return result;
    }
  }
  if (stack.length) {
    result.autoComplete = stack.map((token) => openCloseMap[token]).reverse();
  }
  return result;
};
const illegalScoreMap = { "}": 1197, "]": 57, ">": 25137, ")": 3 };
const autoCompleteScoreMap = { ")": 1, "]": 2, "}": 3, ">": 4 };
const isIllegal = ({ illegal }) => illegal;
const isAutoComplete = ({ autoComplete }) => autoComplete;
const getIllegalScore = ({ illegal }) => illegalScoreMap[illegal];
const getAutoCompleteScore = (token) => autoCompleteScoreMap[token];
const sum = (acc, score) => acc + score;
const compoundScore = (acc, score) => acc * 5 + score;

const part1 = () =>
  data.map(parser).filter(isIllegal).map(getIllegalScore).reduce(sum, 0);

const part2 = () => {
  const scores = data
    .map(parser)
    .filter(isAutoComplete)
    .map(({ autoComplete }) =>
      autoComplete.map(getAutoCompleteScore).reduce(compoundScore, 0)
    )
    .sort((a, b) => a - b);
  return scores[Math.floor(scores.length / 2)];
};

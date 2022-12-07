import { Command, Option, Argument } from "commander";
import { readFile } from "fs/promises";
import fetch from "node-fetch";
const dateFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});
const parts = dateFormat.formatToParts(new Date)
const defaultDate = parts.find(({ type }) => type === 'day').value
const defaultYear = parts.find(({ type }) => type === 'year').value
const program = new Command();
program
  .option("-a, --day [day]", "Date from 1 to 31", d => d.padStart(2, '0'), defaultDate)
  .option("-y, --year [year]", "Year of advent", defaultYear)
  .option("-s, --solution [solution]", "Solution to run", "all")
  .option("-o, --online", "Use online input file", false)
  .option("-i, --input-fileName [fileName]", "Input file name", "input.txt")
program.parse(process.argv);

let { day, year, solution, inputFileName, online } = program.opts();
const solutions = Number.isNaN(parseInt(solution, 10)) ? [1, 2] : parseInt(solution, 10)
let module, inputData;

try {
  module = await import(`./${year}/${day}/index.js`)
} catch (e) {
  console.error(`Could not import solutions for ${year}/${day}`)
  process.exit(1)
}

try {
  inputData = await getInputData(online, inputFileName)
} catch (e) { 
  console.error(`Could not read input file for ${year}/${day}`)
  process.exit(1)
}

for (const n of solutions) {
  if (`solution${n}` in module && typeof module[`solution${n}` === 'function']) {
    try {
      const parsedInput = await module.parse(inputData)
      const answer = await module[`solution${n}`](parsedInput)
      console.group(`Solution ${n}`)
      console.log(answer)
      console.groupEnd(`Solution ${n}`)
    } catch (e) {
      console.warn(`Could not obtain solution ${n}:`, e)
    }
  }
}

function getInputUrl(online, inputFileName) {
  return online 
    ? new URL(`https://adventofcode.com/${year}/day/${parseInt(day, 10)}/input`)
    : new URL(inputFileName, `${import.meta.url}/../${year}/${day}/`)
}

async function getInputData(online, inputFileName) {
  const url = getInputUrl(online, inputFileName)
  if (online) {
    return fetch(url)
      .then(res => res.text())
  } else {
    return (await readFile(url)).toString()
  }
}
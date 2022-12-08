import dotenv from 'dotenv'
dotenv.config()
import { Command, Option } from "commander";
import { readFile, access, mkdir, writeFile, rm } from "fs/promises";
import inquirer from "inquirer";
import fetch from "node-fetch";
import path from 'path';
import { fileURLToPath } from 'url';
const SESSION_KEY = process.env.AOC_SESSION
const INPUT_CACHE = "/tmp/aoc/inputs"
const prompt = inquirer.createPromptModule()
const dateFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});
const parts = dateFormat.formatToParts(new Date)
const defaultDate = parts.find(({ type }) => type === 'day').value
const defaultYear = parts.find(({ type }) => type === 'year').value
const program = new Command("advent")
  .description(`
▄▀█ █▀▄ █░█ █▀▀ █▄░█ ▀█▀   █▀█ █▀▀   █▀▀ █▀█ █▀▄ █▀▀
█▀█ █▄▀ ▀▄▀ ██▄ █░▀█ ░█░   █▄█ █▀░   █▄▄ █▄█ █▄▀ ██▄

A CLI tool to speed up advent operations
`)
  .version('1.0.0')

const dayOption = new Option('-a, --day [day]', "Date from 1 to 31")
  .argParser(d => d.padStart(2, '0'))
  .default(defaultDate, `Current Date ${defaultDate}`)
const yearOption = new Option('-y, --year [year]', "Year of advent")
  .default(defaultYear, `Current Year ${defaultYear}`)

program
  .command('solve')
  .addOption(dayOption)
  .addOption(yearOption)
  .option("-s, --solution [solution]", "Solution to run", "all")
  .action(async ({ day, year, solution }) => {
    const solutions = Number.isNaN(parseInt(solution, 10)) ? [1, 2] : parseInt(solution, 10)
    let module, inputData;

    try {
      module = await import(`./${year}/${day}/index.js`)
    } catch (e) {
      console.error(`Could not import solutions for ${year}/${day}`)
      process.exit(1)
    }

    try {
      inputData = await getInputData({ year, day })
    } catch (e) {
      console.error(`Could not read input file for ${year}/${day}`, e)
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
  })


program.command('scaffold')
  .description('Scaffold the boilerplate for a day of advent')
  .addOption(dayOption)
  .option('-f, --force', "Forces the creation of files even if the directory is not empty")
  .addOption(yearOption)
  .action(async ({ day, year, force }) => {
    const dir = `${dirname()}/${year}/${day}`
    const files = [`index.js`, 'input.txt']
    if (await pathExists(dir)) {
      const existences = await Promise.all(files.map(file => pathExists(`${dir}/${file}`)))
      if (existences.some(i => i) && !force) {
        const answers = await prompt([
          {
            type: 'confirm',
            name: "force",
            message: `The folder ${dir} already contains advent files.\nDo you want to override?`,
            default: false
          }
        ])
        if (!answers.force) return console.log('No changes made');
      }
    } else {
      await mkdir(dir);
    }
    await Promise.all([
      writeFile(`${dir}/index.js`, getDefaultJs()),
      writeFile(`${dir}/input.txt`, await getDefaultInput({ day, year }))
    ])
    console.group("Created")
    files.forEach(file => console.log(`${dir}/${file}`))
    console.groupEnd("Created")
  })

  program.command('cache-clear')
  .action(async() => {
    if(await pathExists(INPUT_CACHE)) {
      await rm(INPUT_CACHE, { recursive: true})
    }
  })

program.parse(process.argv);

async function pathExists(path) {
  try {
    await access(path)
    return true
  } catch (e) {
    return false
  }
}

async function getInputData({ year, day }) {
  return (await readFile(new URL(inputFileName, `${import.meta.url}/../${year}/${day}/`))).toString()
}


function dirname() {
  return path.dirname(fileURLToPath(import.meta.url))
}

function getDefaultJs() {
  return (
    `
export const parse = (input) => {
  return input;
}

export const solution1 = (input) => {
  return "To be implemented"
}

export const solution2 = (input) => {
  return "To be implemented"
}
`);
}

async function getDefaultInput({ day, year }) {
  if (!await pathExists(INPUT_CACHE)) {
    mkdir(INPUT_CACHE, { recursive: true })
  }
  if (await pathExists(`${INPUT_CACHE}/${year}${day}.txt`)) {
    return (await readFile(`${INPUT_CACHE}/${year}${day}.txt`)).toString()
  }
  const data = await fetch(`https://adventofcode.com/${year}/day/${parseInt(day, 10)}/input`, {
    headers: {
      cookie: `session=${SESSION_KEY}`
    }
  })
    .then(res => res.text())
  writeFile(`${INPUT_CACHE}/${year}${day}.txt`, data)
  return data
}
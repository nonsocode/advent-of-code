import { Command, Option, Argument } from "commander";
const dateFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});
const program = new Command();
program
  .argument("<year>", "Year in 4 digits")
  .argument("<month>", "Month in short form e.g jan")
  .argument("<date>", "Date in 2 digits")
  .option(
    new Option(
      "-p, --parts [part]",
      "What part of the solution should be calculated."
    )
      .choices(["1", "2", "all"])
      .default("all")
  )
  .action(4);

program.parse(process.argv);

const options = program.opts();
if (options.debug) console.log(options);
console.log("pizza details:");
if (options.small) console.log("- small pizza size");
if (options.pizzaType) console.log(`- ${options.pizzaType}`);

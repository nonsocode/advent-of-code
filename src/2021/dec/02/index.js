const input = [];
const diagProduct = (input) =>
  apply(
    {
      forward: (cord, val) => (cord.x += val),
      down: (cord, val) => (cord.y += val),
      up: (cord, val) => (cord.y -= val),
    },
    input
  );

const diagProductEnhanced = (input) => apply({
  forward: (cord, val) => {
    cord.x += val;
    cord.y += val * cord.aim;
  },
  down: (cord, val) => (cord.aim += val),
  up: (cord, val) => (cord.aim -= val),
}, input);

const apply = (opMap, input, cord = { x: 0, y: 0, aim: 0 }) => {
  input
    .map((i) => i.split(" "))
    .forEach(([op, val]) => {
      opMap[op](cord, Number(val));
    });
  return cord.x * cord.y;
};
console.log([diagProduct, diagProductEnhanced].map((fn) => fn(input)));

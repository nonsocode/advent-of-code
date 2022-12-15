
export const parse = (input) => {
  return input.trim().split("\n");
}

export const solution1 = (input) => {
  let x = 1;
  let register = null;
  let strength = 0;
  for(let i = 1; register !== null || input.length; i++) {
    if(i === 20 || (i > 20 && (i - 20) % 40 === 0)) {
      const curr = (i * x);
      console.log({i, x, curr})
      strength += i * x
    }
    if(register !== null) {
      x += register;
      register = null;
      continue;
    }
    const instruction = input.shift()
    if(instruction === 'noop') continue;
    register = parseInt(instruction.substring("addx ".length), 10)
  }
  return strength;
}
const FILL = "█"
const EMPT = " "
export const solution2 = (input) => {
  let x = 1;
  let register = null;
  let crt = ""
  for(let i = 1; register !== null || input.length; i++) {
    // draw
    const pos = (i -1) % 40 + 1 
    crt+=(pos >= x && pos <= (x + 2) ? FILL : EMPT)
    if(crt.length === 40) {
      console.log(crt)
      crt = ""
    }
    if(register !== null) {
      x += register;
      register = null;
      continue;
    }
    const instruction = input.shift()
    if(instruction === 'noop') continue;
    register = parseInt(instruction.substring("addx ".length), 10)
  }
  if(crt.length) {
    console.log(crt)
  }
}

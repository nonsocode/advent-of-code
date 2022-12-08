const COL_WIDTH = 4

export const parse = (input) => {
  const [cargoBlock, instructionBlock] = input.split('\n\n')
  const cargo = cargoBlock.replace(/\n$/, '').split('\n')
  cargo.pop()
  const lineLenght = cargo[0].length + 1
  const stacks = Array.from({ length: Math.floor(lineLenght / COL_WIDTH) }, () => [])
  for (let i = 0; i < lineLenght; i += COL_WIDTH) {
    const col = Math.floor(i / COL_WIDTH)
    for (let j = cargo.length - 1; j >= 0 && cargo[j][i + 1] !== " "; j--) {
      stacks[col].push(cargo[j][i + 1])
    }
  }
  const instructions = instructionBlock
    .trim()
    .split('\n')
    .map(line => {
      const { groups } = line.match(/move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)/)
      return {
        count: parseInt(groups.count),
        from: parseInt(groups.from) - 1,
        to: parseInt(groups.to) - 1,
      }
    })
  return { stacks, instructions }

}

export const solution1 = ({stacks, instructions}) => {
  for(let {from, to, count} of instructions) {
    for( let i = 0; i < count; i++) {
      stacks[to].push(stacks[from].pop())
    }
  }
  return stacks.reduce((acc, stack) => {
    return acc + (stack.at(-1) ?? "")
  }, "")
}

export const solution2 = ({stacks, instructions}) => {
  for(let {from, to, count} of instructions) {
    for( let i = stacks[from].length - count; i < stacks[from].length; i++) {
      stacks[to].push(stacks[from][i])
    }
    stacks[from].length = stacks[from].length - count
  }
  return stacks.reduce((acc, stack) => {
    return acc + (stack.at(-1) ?? "")
  }, "")
}

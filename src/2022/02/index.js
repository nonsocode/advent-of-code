const them = ["A", "B", "C"]
const me = ["X", "Y", "Z"]
const themMap = Object.fromEntries(Object.entries(them).map(([key, val]) => [val, key]))
const meMap = Object.fromEntries(Object.entries(me).map(([key, val]) => [val, key]))

export const parse = (input) => {
  return input.split('\n').map(pair => pair.split(' '))
}

export const solution1 = (input) => {
  return input.reduce((score, [opponent, me]) => {
    if ([1, -2].includes(meMap[me] - themMap[opponent])) {
      return score + 6 + parseInt(meMap[me], 10) + 1
    }
    if ([-1, 2].includes(meMap[me] - themMap[opponent])) {
      return score + 0 + parseInt(meMap[me], 10) + 1
    }
    return score + 3 + parseInt(meMap[me], 10) + 1
  }, 0)
}

export const solution2 = (input) => {
  const expectationMap = {
    X: -1,
    Y: 0,
    Z: 1
  }
  return input.reduce((score, [opponent, me]) => {
    let res = parseInt(themMap[opponent], 10) + expectationMap[me]
    res = res < 0 ? 2 : res % 3
    return score + res + 1 + parseInt(meMap[me], 10) * 3
  }, 0)
}
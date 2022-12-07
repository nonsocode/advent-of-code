const map = {
  "X": {
    wins: "C",
    loses: "B",
    weight: 1
  },
  "Y": {
    wins: "A",
    loses: "C",
    weight: 2,
  },
  "Z": {
    wins: "B",
    loses: "A",
    weight: 3,
  }
}

export const parse = (input) => {
  return input.split('\n').map(pair => pair.split(' '))
}

export const solution1 = (input) => {
  return input.reduce((score, [opponent, me]) => {
    if (map[me].wins === opponent) {
      return score + 6 + map[me].weight
    }
    if (map[me].loses === opponent) {
      return score + 0 + map[me].weight
    }
    return score + 3 + map[me].weight
  }, 0)
}

export const solution2 = (input) => {
  return "To be Implemented"
}
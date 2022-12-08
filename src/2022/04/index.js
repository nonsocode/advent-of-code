
export const parse = (input) => {
  return input
    .trim()
    .split('\n')
    .map(pairs => pairs
      .split(',')
      .map(pair => pair
        .split('-')
        .map(number => parseInt(number, 10))
      )
    )
}

export const solution1 = (input) => {
  let total = 0;
  for (let [p0, p1] of input) {
    if (
      ((p0[0] <= p1[0]) && (p0[1] >= p1[1])) ||
      ((p0[0] >= p1[0]) && (p0[1] <= p1[1])) 
    ) total++
  }
  return total
}

export const solution2 = (input) => {
  let total = 0;
  for (let [p0, p1] of input) {
    if (
      ((p0[0] <= p1[1]) && (p0[0] >= p1[0])) ||
      ((p0[1] <= p1[1]) && (p0[1] >= p1[0])) ||
      ((p0[0] <= p1[0]) && (p0[1] >= p1[1])) ||
      ((p0[0] >= p1[0]) && (p0[1] <= p1[1])) 

    ) total++
  }
  return total}

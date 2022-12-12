
export const parse = (input) => {
  return input.trim().split('\n').map(line => line.split(''));
}

export const solution1 = (input) => {
  let total = 0
  const blockCache = new Array(input[0].length).fill(-Infinity)
  const seen = new Set()
  for (let i = 0; i < input.length; i++) {
    let maxInline = -Infinity
    for (let j = 0; j < input[i].length; j++) {
      if (i === 0 || i === input.length - 1 || j === 0 || j === input[i].length - 1 || blockCache[j] < input[i][j] || input[i][j] > maxInline) {
        total++
        seen.add(`${i},${j}`)
      }
      blockCache[j] = Math.max(blockCache[j], input[i][j])
      maxInline = Math.max(maxInline, input[i][j])
    }
  }
  blockCache.fill(-Infinity)

  for (let i = input.length - 1; i >= 0; i--) {
    let maxInline = -Infinity
    for (let j = input[i].length - 1; j >= 0; j--) {
      if (!seen.has(`${i},${j}`) && (i === 0 || i === input.length - 1 || j === 0 || j === input[i].length - 1 || blockCache[j] < input[i][j] || input[i][j] > maxInline)) {
        total++
        seen.add(`${i},${j}`)
      }
      blockCache[j] = Math.max(blockCache[j], input[i][j])
      maxInline = Math.max(maxInline, input[i][j])
    }
  }

  return total
}

export const solution2 = (input) => {
  let score = 0;
  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 1; j < input[i].length - 1; j++) {
      let c = 0
      let m = 1;
      //left;
      c = 0
      for (let k = j - 1; k >= 0; k--) {
        c++;
        if (input[i][k] >= input[i][j]) break;
      }
      m *= c
      //right
      c = 0
      for (let k = j + 1; k < input[i].length; k++) {
        c++;
        if (input[i][k] >= input[i][j]) break;
      }
      m *= c
      //bottom 
      c = 0
      for (let k = i + 1; k < input.length; k++) {
        c++;
        if (input[k][j] >= input[i][j]) break;
      }
      m *= c

      //top
      c = 0
      for (let k = i - 1; k >= 0; k--) {
        c++;
        if (input[k][j] >= input[i][j]) break;
      }
      m *= c

      score = Math.max(score, m)
    }
  }
  return score
}
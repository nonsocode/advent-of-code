
export const parse = (input) => {
  return input.split('\n');
}
// should probably use bitwise operations to reduce memory usage
export const solution1 = (input) => {
  return input.reduce((total, str) => {
    const mid = Math.floor(str.length / 2)
    const set = new Set()
    for(let i = 0; i < mid; i++) {
      set.add(str[i])
    }
    for(let i = mid; i < str.length; i++) {
      if(set.has(str[i])) {
        const code = str.charCodeAt(i)
        return total + (code >= 97 ? code - 96 : code - 38)
      }
    }
    return total;
  }, 0)
}

export const solution2 = (input) => {
  let start = new Set()
  let end = new Set()
  let total = 0;
  
  for(let i = 0; i < input.length; i++) {
    if(i % 3 === 0) {
      ["a", "A"].forEach(char => {
        for(let i = char.charCodeAt(0); i < char.charCodeAt(0) + 26; i++) {
          start.add(String.fromCharCode(i))
        }
      })
    }
    for(let char of input[i]) {
      if(start.has(char)) {
        end.add(char)
      }
    }
    start = end
    end = new Set()
    if(i % 3 == 2) {
      const code = [...start][0].charCodeAt(0)
      total += (code >= 97 ? code - 96 : code - 38)
    }
  }
  return total
}

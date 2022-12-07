export const parse = (input) => input.split('\n')

export const solution1 = (input) => {
  let [max, current] = [0, 0];
  for (let str of input) {
    if (str !== "") {
      current += parseInt(str, 10)
      continue;
    }
    max = current > max ? current : max
    current = 0
  }
  return current > max ? current : max
}

export const solution2 = (input) => {
  const top = new Top(3)
  let current = 0
  for (let str of input) {
    if (str !== "") {
      current += parseInt(str, 10)
      continue;
    }
    if (current >= top.min()) {
      top.add(current)
    }
    current = 0
  }
  return top.total()
}
class Top {
  items = []
  constructor(capacity) {
    this.capacity = capacity;
    this.items
  }

  add(item) {
    this.insert(item)
  }

  min() {
    return this.items.length ? this.items.at(-1) : -Infinity
  }

  total() {
    return this.items.reduce((a, i) => a + i, 0)
  }

  insert(item) {
    let [l, r] = [0, this.items.length - 1]
    let m = 0
    while (l <= r) {
      const m = Math.floor((l + r) / 2)
      if (this.items[m] > item) {
        l = m + 1
      } else {
        r = m - 1
      }
    }
    this.items.splice(l, 0, item)
    this.items.length = Math.min(this.items.length, this.capacity)
  }
}

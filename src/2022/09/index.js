
export const parse = (input) => {
  return input.trim().split("\n").map(line => line.split(" "));
}
// [hor, vert]
const dirMap = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0]
}
export const solution1 = (input) => {
  let head = [0, 0]
  let tail = [0, 0]
  const seen = new Set()
  for (const [dir, count] of input) {
    const mult = dirMap[dir]
    const newTail = [null, null]
    const newHead = [head[0] + count * mult[0], head[1] + count * mult[1]]
    let y = newHead[1] - tail[1]
    if (Math.abs(y) > 1) {
      newTail[1] = (Math.abs(y) - 1) * Math.sign(y) + tail[1]
      newTail[0] = newHead[0]
    }

    let x = newHead[0] - tail[0]
    if (Math.abs(x) > 1) {
      newTail[0] = (Math.abs(x) - 1) * Math.sign(x) + tail[0]
      newTail[1] = newHead[1]
    }
    newTail[0] = newTail[0] ?? tail[0]
    newTail[1] = newTail[1] ?? tail[1]
    const firstPos = dist(newHead, tail) > 2 ** .5
      ? [tail[0] + Math.sign(newHead[0] - tail[0]), tail[1] + Math.sign(newHead[1] - tail[1])]
      : tail;
    if (newTail[0] === firstPos[0]) {
      for (let i = Math.min(firstPos[1], newTail[1]); i <= Math.max(firstPos[1], newTail[1]); i++) {
        seen.add(`${firstPos[0]},${i}`)
      }
    } else if (newTail[1] === firstPos[1]) {
      for (let i = Math.min(firstPos[0], newTail[0]); i <= Math.max(firstPos[0], newTail[0]); i++) {
        seen.add(`${i},${firstPos[1]}`)
      }
    }
    tail = newTail
    head = newHead
  }
  return seen.size
}



export const solution2 = (input) => {
  const rope = new Rope(10)
  for (const [dir, count] of input) { 
    rope.move(dir, count)
  }
  return rope.trail.size
}

function dist(cord1, cord2) {
  return ((cord1[0] - cord2[0]) ** 2 * (cord1[1] - cord2[1]) ** 2) ** .5
}

class Rope {
  head
  tail
  trail = new Set()
  constructor(length) {
    let current;
    for (let i = 0; i < length; i++) {
      const link = new Link();
      if (!this.head) {
        this.head = link
      }
      if (current) {
        current.next = link
      }
      current = link;
    }
    this.tail = current;
    this.trail.add(this.tail.cordHash())
  }

  move(dir, amount) {
    for (let i = 0; i < amount; i++) {
      this.head.moveBy(dirMap[dir][0], dirMap[dir][1])
      this.head.pull();
      this.trail.add(this.tail.cordHash())
    }
  }
}

class Link {
  x
  y
  next;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  cordHash() { return `${this.x},${this.y}` }

  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy
  }

  pull() {
    if(!this.next ||(Math.abs(this.x - this.next.x) <= 1 && Math.abs(this.y - this.next.y) <= 1)) return;
    const dx = Math.abs(this.x - this.next.x) > 1
      ? Math.sign(this.x - this.next.x) * (Math.abs(this.x - this.next.x) - 1)
      : this.x - this.next.x
    const dy = Math.abs(this.y - this.next.y) > 1
      ? Math.sign(this.y - this.next.y) * (Math.abs(this.y - this.next.y) - 1)
      : this.y - this.next.y
    this.next.moveBy(dx, dy)
    this.next.pull()
  }
}
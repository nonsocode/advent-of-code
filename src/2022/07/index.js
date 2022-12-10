const LS = "$ ls"
const CD = "$ cd "
const DIR = "dir "
const FS = 70_000_000
const TUS = 30_000_000
export const parse = (input) => {
  return input.trim().split('\n');
}
/**
 * 
 * @param {string[]} input 
 * @returns 
 */
export const solution1 = (input) => {
  const dirTree = buildTree(input)
  let total = 0

  calcSize('/', dirTree, (dir, size) => {
    total += size <= 100000 ? size : 0
  })
  return total
}

export const solution2 = (input) => {
  const dirTree = buildTree(input)
  const rootSize = calcSize('/', dirTree)
  const remaining = FS - rootSize
  const needed = TUS - remaining

  return Object
    .entries(dirTree)
    .map(([, { totalSize }]) => totalSize)
    .sort((a, b) => a - b)
    .find(a => a >= needed)
}


/**
 * 
 * @param {string} root 
 * @param {Record<string, {size: number, children: string[]}>} tree 
 * @param {(dir: string, total: number) => void} onSize 
 */
function calcSize(root, tree, onSize) {
  const dir = tree[root];
  const size = dir.size + dir.children.reduce((acc, child) => {
    return acc + calcSize(`${root === '/' ? '' : root}/${child}`, tree, onSize)
  }, 0)
  dir.totalSize = size
  onSize?.(root, size)
  return size
}

function calcPath(stack) {
  return stack.length === 1 ? stack[0] : `${stack[0]}${stack.slice(1).join('/')}`
}

function buildTree(input) {
  const dirStack = []
  const dirTree = {}
  let path;

  for (let i = 0; i < input.length; i++) {
    const cmd = input[i]
    if (cmd === LS) continue;
    else if (cmd.startsWith(CD)) {
      const dir = cmd.substring(0 + CD.length)
      if (dir === '..') {
        dirStack.pop()
        path = calcPath(dirStack)
      } else {
        dirStack.push(dir)
        dirTree[path = calcPath(dirStack)] = {
          size: 0,
          children: []
        }
      }
    }
    else if (cmd.startsWith(DIR)) {
      dirTree[path].children.push(cmd.substring(0 + DIR.length))
    }
    else dirTree[path].size += parseInt(cmd.split(" ")[0], 10)
  }
  return dirTree
}
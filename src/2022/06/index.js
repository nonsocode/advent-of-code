
export const parse = (input) => {
  return input;
}

export const solution1 = (input) => {
  return startOfPacket(input, 4)
}

export const solution2 = (input) => {
  return startOfPacket(input, 14)
}

function startOfPacket(input, markersize) {
  for(let i = markersize; i <= input.length; i++) {
    if(new Set(input.slice(i - markersize, i)).size === input.slice(i - markersize, i).length)
    return i 
  }
  throw Error('Marker not found')
}
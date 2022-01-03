export const time = (fn, name) => {
    console.time(name)
    const res = fn()
    console.timeEnd(name)
    return res
}